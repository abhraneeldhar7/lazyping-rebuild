"use server"
import { EndpointType, PingLog, ProjectType } from "@/lib/types";
import { getEndpointDetails } from "./endpointActions";
import { getDB } from "@/lib/db";
import redis from "@/lib/redis";
import { deserialize, serialize } from "@/lib/utils";

// Thresholds
const LATENCY_DEGRADED_THRESHOLD = 2000; // ms
const CONSECUTIVE_FAILURES_THRESHOLD = 2;
const TIMEOUT_MS = 10000; // 10 seconds

/**
 * Placeholder for GitHub issue alerting
 * TODO: Implement actual GitHub issue creation
 */
async function alertGithubIssue(endpoint: EndpointType, type: "DOWN" | "RECOVERED") {
    // console.log(`[ALERT] ${type}: ${endpoint.url}`);
    // TODO: Create GitHub issue via API
}

/**
 * Determine the PingLog status based on HTTP response or error
 */
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
        if (error.cause?.code === "ENOTFOUND") return "DNS";
        if (error.cause?.code === "ECONNREFUSED") return "CONN_REFUSED";
        if (error.cause?.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") return "TLS";
        if (error.message?.includes("certificate")) return "TLS";
    }

    return "UNKNOWN";
}

/**
 * Determine the endpoint status (UP/DEGRADED/DOWN) based on ping result
 */
function determineEndpointStatus(
    pingLogStatus: PingLog['status'],
    latency: number | null
): "UP" | "DEGRADED" | "DOWN" {
    // DOWN: Any error status or timeout
    if (pingLogStatus !== "OK") {
        return "DOWN";
    }

    // DEGRADED: Status 200-299 BUT high latency
    if (latency !== null && latency >= LATENCY_DEGRADED_THRESHOLD) {
        return "DEGRADED";
    }

    // UP: Status 200-299 AND acceptable latency
    return "UP";
}

/**
 * Generate human-readable log summary
 */
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
        default:
            const msg = error instanceof Error ? error.message : typeof error === 'string' ? error : "Unknown error";
            return `Ping failed: ${msg}`;
    }
}

/**
 * Pings a single endpoint and updates its status in the database
 * Implements two-strike rule and alerting logic
 */
export async function pingEndpoint(
    endpointOrId: string | EndpointType,
    dbInstance?: any
): Promise<PingLog> {
    const db = dbInstance || await getDB();

    // 1. Get endpoint details
    let endpoint: EndpointType;
    if (typeof endpointOrId === 'string') {
        endpoint = await getEndpointDetails(endpointOrId);
    } else {
        endpoint = endpointOrId;
    }

    // 2. Perform the ping
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response | null = null;
    let error: any = null;
    let responseBody: string | null = null;

    const startTime = performance.now();
    try {
        response = await fetch(endpoint.url, {
            method: endpoint.method,
            headers: endpoint.headers || {},
            body: endpoint.body || undefined,
            signal: controller.signal,
        });

        // Read response body (limit to 500 chars for storage)
        const text = await response.text();

        // Try to parse and re-stringify JSON for consistent formatting
        // If it's not JSON, just store the text as-is
        try {
            const parsed = JSON.parse(text);
            responseBody = JSON.stringify(parsed).slice(0, 500);
        } catch {
            // Not JSON, store as plain text
            responseBody = text.slice(0, 500);
        }
    } catch (err) {
        error = err;
    } finally {
        clearTimeout(timeoutId);
    }

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    // 3. Determine statuses
    const pingLogStatus = determinePingLogStatus(response, error);
    const newEndpointStatus = determineEndpointStatus(pingLogStatus, latency);
    const logSummary = generateLogSummary(
        pingLogStatus,
        endpoint.method,
        endpoint.url,
        response?.status || null,
        latency,
        error
    );

    // 4. Create PingLog
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

    // 5. Insert log into database
    await db.collection('logs').insertOne(log);

    // 6. Apply Two-Strike Rule
    const isSuccess = newEndpointStatus === "UP" || newEndpointStatus === "DEGRADED";
    const previousStatus = endpoint.currentStatus;
    const previousConsecutiveFailures = endpoint.consecutiveFailures;

    let newConsecutiveFailures: number;
    let actualNewStatus: EndpointType['currentStatus'];

    if (isSuccess) {
        // Success: Reset consecutive failures
        newConsecutiveFailures = 0;
        actualNewStatus = newEndpointStatus;
    } else {
        // Failure: Increment consecutive failures
        newConsecutiveFailures = previousConsecutiveFailures + 1;

        // Only change to DOWN if we've hit the threshold
        if (newConsecutiveFailures >= CONSECUTIVE_FAILURES_THRESHOLD) {
            actualNewStatus = "DOWN";
        } else {
            // First failure: Keep previous status (or set to DEGRADED if no previous status)
            actualNewStatus = previousStatus || "DEGRADED";
        }
    }

    const statusChanged = previousStatus !== actualNewStatus;

    // 7. Alerting Logic
    // DOWN Alert: Only when consecutiveFailures hits exactly the threshold
    if (!isSuccess && newConsecutiveFailures === CONSECUTIVE_FAILURES_THRESHOLD) {
        await alertGithubIssue(endpoint, "DOWN");
    }

    // RECOVERY Alert: Only when previous status was DOWN and current result is UP or DEGRADED
    if (isSuccess && previousStatus === "DOWN") {
        await alertGithubIssue(endpoint, "RECOVERED");
    }

    // 8. Update Endpoint in database
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

    // Update Redis
    // Fetch latest from connection to ensure we preserve fields like Name/Body that might have changed
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

    // 9. Update Project status (only if endpoint status changed)
    if (statusChanged) {
        // Optimisation: Fetch endpoints from Redis to calculate status
        let updatedEndpoints: any[] = [];

        // Try getting from Redis first
        const endpointIds = await redis.smembers(`project:${endpoint.projectId}:endpoints`);
        if (endpointIds.length > 0) {
            const keys = endpointIds.map(id => `endpoint:${id}`);
            const cached = await redis.mget(keys);
            updatedEndpoints = cached
                .map(e => deserialize<EndpointType>(e))
                .filter(e => e !== null);
        }

        // Fallback to DB if cache empty (or partial?)
        if (updatedEndpoints.length === 0) {
            updatedEndpoints = await db.collection("endpoints")
                .find({ projectId: endpoint.projectId })
                .toArray();
        }

        // Just in case the *current* endpoint update hasn't propagated or we fetched stale data (if we fetched before the update above completed technically, but we just updated Redis)
        // Actually, we just updated Redis for *this* endpoint above. So if we fetch from Redis, we get the NEW status.
        // If we fetched from DB, we might NOT get the new status if the write hasn't settled (mongo eventual consistency?), but usually Read-after-Write in same session is fine?
        // To be safe, let's manually splice the new status into the array.
        updatedEndpoints = updatedEndpoints.map((e: any) =>
            e.endpointId === endpoint.endpointId
                ? { ...e, currentStatus: actualNewStatus } // Ensure current one is correct
                : e
        );


        // Calculate project status
        const downCount = updatedEndpoints.filter((e: any) => e.currentStatus === "DOWN").length;
        const degradedCount = updatedEndpoints.filter((e: any) => e.currentStatus === "DEGRADED").length;
        const totalCount = updatedEndpoints.length;

        let projectStatus: ProjectType['overallStatus'] = "OPERATIONAL";

        if (downCount === totalCount && totalCount > 0) {
            projectStatus = "MAJOR_OUTAGE";
        } else if (downCount > 0) {
            projectStatus = "PARTIAL_OUTAGE";
        } else if (degradedCount > 0) {
            projectStatus = "DEGRADED";
        }

        await db.collection("projects").updateOne(
            { projectId: endpoint.projectId },
            { $set: { overallStatus: projectStatus } }
        );

        // Update Project in Redis
        // We need the full project object.
        const project = await deserialize<ProjectType>(await redis.get(`project:${endpoint.projectId}`));
        if (project) {
            project.overallStatus = projectStatus;
            await redis.set(`project:${endpoint.projectId}`, serialize(project));
        }
    }

    return JSON.parse(JSON.stringify(log));
}
