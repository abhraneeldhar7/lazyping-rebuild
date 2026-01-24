"use server"
import { EndpointType, PingLog, ProjectType } from "@/lib/types";
import { getEndpointDetails } from "./endpointActions";
import { getDB } from "@/lib/db";
import redis from "@/lib/redis";
import { deserialize, serialize } from "@/lib/utils";

const LATENCY_DEGRADED_THRESHOLD = 5000;
const OUTAGE_THRESHOLD = 3;
const TIMEOUT_MS = 10000;

async function projectOutage(endpoint: EndpointType, type: "WARNING" | "OUTAGE" | "RESOLVED", data?: any) {
    console.log(`[ALERT SYSTEM] Project Outage/Alert: ${type} for ${endpoint.endpointName}`, data);
}


function determinePingLogStatus(
    response: Response | null,
    error: any
): PingLog['status'] {
    if (response) {
        if (response.status >= 200 && response.status < 400) return "OK";
        if (response.status === 429) return "RATE_LIMITED";
        if (response.status >= 400 && response.status < 500) return "HTTP_4XX";
        if (response.status >= 500) return "HTTP_5XX";
    }

    if (error) {
        if (error.name === "AbortError") return "TIMEOUT";
        if (error.name === "TypeError" && error.message?.includes("Invalid URL")) return "INVALID_URL";
        if (error.cause?.code === "ENOTFOUND") return "DNS";
        if (error.cause?.code === "ECONNREFUSED") return "CONN_REFUSED";
        if (error.cause?.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") return "TLS";
        if (error.message?.includes("certificate")) return "TLS";
    }

    return "UNKNOWN";
}

function determineEndpointStatus(
    pingLogStatus: PingLog['status'],
    latency: number | null
): "UP" | "DEGRADED" | "DOWN" {
    if (pingLogStatus !== "OK") {
        return "DOWN";
    }

    if (latency !== null && latency >= LATENCY_DEGRADED_THRESHOLD) {
        return "DEGRADED";
    }

    return "UP";
}

function generateLogSummary(
    status: PingLog['status'],
    method: string,
    url: string,
    statusCode: number | null,
    latency: number,
    error: any
): string {
    switch (status) {
        case "OK":
            return `${method} ${url} responded with ${statusCode} in ${latency}ms`;
        case "TIMEOUT":
            return `Request timed out after ${TIMEOUT_MS}ms`;
        case "DNS":
            return `DNS resolution failed for ${url}`;
        case "CONN_REFUSED":
            return `Connection refused to ${url}`;
        case "TLS":
            return `SSL/TLS handshake failed for ${url}`;
        case "RATE_LIMITED":
            return `Rate limit exceeded (429) for ${url}`;
        case "HTTP_4XX":
            return `Client error: ${statusCode} for ${url}`;
        case "HTTP_5XX":
            return `Server error: ${statusCode} for ${url}`;
        case "INVALID_URL":
            return `The URL provided is invalid: ${url}`;
        case "RESOLVED":
            return `Incident resolved. Endpoint is back online.`;
        default:
            const msg = error instanceof Error ? error.message : typeof error === 'string' ? error : "Unknown error";
            return `Ping failed: ${msg}`;
    }
}

export async function pingEndpoint(
    endpointOrId: string | EndpointType,
    dbInstance?: any
): Promise<PingLog> {
    const db = dbInstance || await getDB();

    let endpoint: EndpointType;
    if (typeof endpointOrId === 'string') {
        endpoint = await getEndpointDetails(endpointOrId);
    } else {
        endpoint = endpointOrId;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response | null = null;
    let error: any = null;
    let responseBody: string | null = null;

    const startTime = performance.now();
    try {
        // Basic URL validation before fetch
        if (!endpoint.url || !endpoint.url.startsWith("http")) {
            throw new TypeError("Invalid URL");
        }

        response = await fetch(endpoint.url, {
            method: endpoint.method,
            headers: endpoint.headers || {},
            body: endpoint.body || undefined,
            signal: controller.signal,
        });

        // Read only first small chunk of response to avoid OOM for large files
        const reader = response.body?.getReader();
        if (reader) {
            let receivedLength = 0;
            const chunks = [];
            while (receivedLength < 2000) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
            }
            reader.cancel(); // Stop reading
            const fullResult = new Uint8Array(receivedLength);
            let offset = 0;
            for (const chunk of chunks) {
                fullResult.set(chunk, offset);
                offset += chunk.length;
            }
            const text = new TextDecoder().decode(fullResult);

            try {
                const parsed = JSON.parse(text);
                responseBody = JSON.stringify(parsed).slice(0, 500);
            } catch {
                responseBody = text.slice(0, 500);
            }
        }
    } catch (err) {
        error = err;
    } finally {
        clearTimeout(timeoutId);
    }

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    const pingLogStatus = determinePingLogStatus(response, error);
    const potentialNewStatus = determineEndpointStatus(pingLogStatus, latency);
    const logSummary = generateLogSummary(
        pingLogStatus,
        endpoint.method,
        endpoint.url,
        response?.status || null,
        latency,
        error
    );

    const log: PingLog = {
        projectId: endpoint.projectId,
        endpointId: endpoint.endpointId,
        url: endpoint.url,
        method: endpoint.method,
        timestamp: new Date(),
        latencyMs: pingLogStatus === "TIMEOUT" ? null : latency,
        status: pingLogStatus,
        statusCode: response?.status || null,
        responseMessage: responseBody,
        errorMessage: error instanceof Error ? error.message : typeof error === 'string' ? error : null,
        logSummary
    };

    await db.collection('logs').insertOne(log);
    await redis.incr("system:total-pings");

    const isSuccess = potentialNewStatus === "UP" || potentialNewStatus === "DEGRADED";
    const previousStatus = endpoint.currentStatus;
    const previousConsecutiveFailures = endpoint.consecutiveFailures;

    let newConsecutiveFailures: number;
    let actualNewStatus: EndpointType['currentStatus'];

    if (isSuccess) {
        newConsecutiveFailures = 0;
        actualNewStatus = potentialNewStatus;
    } else {
        newConsecutiveFailures = previousConsecutiveFailures + 1;

        if (newConsecutiveFailures >= OUTAGE_THRESHOLD) {
            actualNewStatus = "DOWN";
        } else {
            actualNewStatus = "DEGRADED";
        }
    }

    const statusChanged = previousStatus !== actualNewStatus;

    if (!isSuccess) {
        if (newConsecutiveFailures >= OUTAGE_THRESHOLD) {
            await projectOutage(endpoint, "OUTAGE", { failures: newConsecutiveFailures });
        } else {
            await projectOutage(endpoint, "WARNING", { failures: newConsecutiveFailures });
        }
    }

    if (isSuccess && previousStatus === "DOWN") {
        await projectOutage(endpoint, "RESOLVED");

        const resolvedLog: PingLog = {
            projectId: endpoint.projectId,
            endpointId: endpoint.endpointId,
            url: endpoint.url,
            method: endpoint.method,
            timestamp: new Date(Date.now() + 100),
            latencyMs: log.latencyMs,
            status: "RESOLVED",
            statusCode: log.statusCode,
            responseMessage: null,
            errorMessage: null,
            logSummary: "Endpoint recovered. Outage resolved."
        };
        await db.collection('logs').insertOne(resolvedLog);
    }

    await db.collection("endpoints").updateOne(
        { endpointId: endpoint.endpointId },
        {
            $set: {
                currentStatus: actualNewStatus,
                latency: log.latencyMs,
                lastPingedAt: log.timestamp,
                nextPingAt: new Date(Date.now() + endpoint.intervalMinutes * 60000),
                consecutiveFailures: newConsecutiveFailures,
                ...(statusChanged && { lastStatusChange: log.timestamp })
            }
        }
    );

    const freshEndpointData = await deserialize<EndpointType>(await redis.get(`endpoint:${endpoint.endpointId}`)) || endpoint;

    const updatedEndpointObj = {
        ...freshEndpointData,
        currentStatus: actualNewStatus,
        latency: log.latencyMs,
        lastPingedAt: log.timestamp,
        nextPingAt: new Date(Date.now() + endpoint.intervalMinutes * 60000),
        consecutiveFailures: newConsecutiveFailures,
        ...(statusChanged && { lastStatusChange: log.timestamp })
    };
    await redis.set(`endpoint:${endpoint.endpointId}`, serialize(updatedEndpointObj));

    try {
        const cachedProject = await deserialize<ProjectType>(await redis.get(`project:${endpoint.projectId}`));
        const projectNeedsUpdate = statusChanged || (cachedProject && cachedProject.overallStatus === null);

        if (projectNeedsUpdate) {
            await updateProjectStatus(endpoint.projectId, db);
        }
    } catch (err) {
        console.error(`Failed to update project status for ${endpoint.projectId}:`, err);
    }

    return JSON.parse(JSON.stringify(log));
}

export async function updateProjectStatus(projectId: string, dbInstance?: any) {
    const db = dbInstance || await getDB();

    // 1. Get all endpoints for this project
    let endpoints: EndpointType[] = [];
    const endpointIds = await redis.smembers(`project:${projectId}:endpoints`);

    if (endpointIds.length > 0) {
        const keys = endpointIds.map(id => `endpoint:${id}`);
        const cached = await redis.mget(keys);
        endpoints = cached
            .map(e => deserialize<EndpointType>(e))
            .filter((e): e is EndpointType => e !== null);
    }

    if (endpoints.length === 0 || endpoints.length < endpointIds.length) {
        endpoints = await db.collection("endpoints")
            .find({ projectId: projectId })
            .toArray() as EndpointType[];
    }

    // 2. Filter to only ENABLED endpoints
    const enabledEndpoints = endpoints.filter(e => e.enabled);

    const downCount = enabledEndpoints.filter(e => e.currentStatus === "DOWN").length;
    const degradedCount = enabledEndpoints.filter(e => e.currentStatus === "DEGRADED").length;
    const totalCount = enabledEndpoints.length;

    let projectStatus: ProjectType['overallStatus'] = "OPERATIONAL";

    if (totalCount === 0) {
        projectStatus = "OPERATIONAL"; // Or "UNKNOWN/null" if you prefer
    } else if (downCount === totalCount) {
        projectStatus = "MAJOR_OUTAGE";
    } else if (downCount > 0) {
        projectStatus = "PARTIAL_OUTAGE";
    } else if (degradedCount > 0) {
        projectStatus = "DEGRADED";
    }

    // 3. Update DB
    await db.collection("projects").updateOne(
        { projectId: projectId },
        { $set: { overallStatus: projectStatus } }
    );

    // 4. Update Cache
    const project = await deserialize<ProjectType>(await redis.get(`project:${projectId}`));
    if (project) {
        project.overallStatus = projectStatus;
        await redis.set(`project:${projectId}`, serialize(project));
    } else {
        // If not in cache, fetch from DB to be sure it's cached correctly now
        const dbProject = await db.collection("projects").findOne({ projectId: projectId }, { projection: { _id: 0 } });
        if (dbProject) {
            await redis.set(`project:${projectId}`, serialize(dbProject));
        }
    }

    return projectStatus;
}

export async function getTotalPingCount() {
    const cachedCount = await redis.get("system:total-pings");
    if (cachedCount) return Number(cachedCount);

    const db = await getDB();
    const count = await db.collection("logs").estimatedDocumentCount();

    await redis.set("system:total-pings", count);
    return count;
}
