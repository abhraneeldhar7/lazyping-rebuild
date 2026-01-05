"use server"
import { EndpointType, PingLog, ProjectType } from "@/lib/types"; // Adjust path as needed
import { getEndpointDetails } from "./endpointActions";
import { getDB } from "@/lib/db";

// Helper to determine the status based on HTTP code or Error
function determineStatus(
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
        // Node.js specific error codes
        if (error.name === "AbortError") return "TIMEOUT";
        if (error.cause?.code === "ENOTFOUND") return "DNS";
        if (error.cause?.code === "ECONNREFUSED") return "CONN_REFUSED";
        if (error.cause?.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") return "TLS";
        if (error.message.includes("certificate")) return "TLS";
    }

    return "UNKNOWN";
}

/**
 * Pings a single endpoint and returns a formatted log entry.
 * Note: Requires 'projectName' passed separately as it's not in the EndpointType usually.
 */
export async function pingEndpoint(
    endpointOrId: string | EndpointType,
    dbInstance?: any
): Promise<PingLog> {
    const db = dbInstance || await getDB()

    let endpoint: EndpointType;
    if (typeof endpointOrId === 'string') {
        endpoint = await getEndpointDetails(endpointOrId);
    } else {
        endpoint = endpointOrId;
    }

    const controller = new AbortController();
    // Use endpoint.intervalMinutes or a dedicated timeout field if you add one later.
    // Defaulting to 10 seconds timeout to prevent hanging.
    const timeoutId = setTimeout(() => controller.abort(), 5000);


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

        // We try to read the body, but guard against large responses
        const text = await response.text();
        responseBody = text.slice(0, 500); // Only store first 500 chars to save DB space
    } catch (err) {
        error = err;
    } finally {
        clearTimeout(timeoutId);
    }

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    const status = determineStatus(response, error);

    // Generate a human-readable summary based on status
    let logSummary: string;

    switch (status) {
        case "OK":
            logSummary = `${endpoint.method} ${endpoint.url} responded with ${response?.status} in ${latency}ms`;
            break;
        case "TIMEOUT":
            logSummary = `Request timed out after 5000ms`;
            break;
        case "DNS":
            logSummary = `DNS resolution failed`;
            break;
        case "CONN_REFUSED":
            logSummary = `Connection refused`;
            break;
        case "TLS":
            logSummary = `SSL/TLS handshake failed`;
            break;
        case "RATE_LIMITED":
            logSummary = `Rate limit exceeded (429)`;
            break;
        case "HTTP_4XX":
            logSummary = `Client error: ${response?.status}`;
            break;
        case "HTTP_5XX":
            logSummary = `Server error: ${response?.status}`;
            break;
        default:
            const msg = error instanceof Error ? error.message : typeof error === 'string' ? error : "Unknown error";
            logSummary = `Ping failed: ${msg}`;
            break;
    }

    // Construct the Log
    const log: PingLog = {
        projectId: endpoint.projectId,
        endpointId: endpoint.endpointId,
        url: endpoint.url,
        method: endpoint.method,

        timestamp: new Date(),
        latencyMs: status === "TIMEOUT" ? null : latency, // Latency is irrelevant on timeout
        status: status,
        statusCode: response?.status || null,

        responseMessage: responseBody,
        errorMessage: error instanceof Error ? error.message : typeof error === 'string' ? error : null,

        logSummary
    };

    // --- DB Operations ---
    await db.collection('logs').insertOne(log);

    const isSuccess = log.status === "OK";
    const newStatus = isSuccess ? "UP" : "DOWN";
    const statusChanged = endpoint.currentStatus !== newStatus;

    // 1. Update Endpoint
    await db.collection("endpoints").updateOne(
        { endpointId: endpoint.endpointId },
        {
            $set: {
                currentStatus: newStatus,
                latency: log.latencyMs,
                lastPingedAt: log.timestamp,
                nextPingAt: new Date(Date.now() + endpoint.intervalMinutes * 60000),
                ...(statusChanged && { lastStatusChange: log.timestamp })
            },
            $inc: {
                consecutiveFailures: isSuccess ? -endpoint.consecutiveFailures : 1
                // Reset to 0 if success, else increment
            }
        }
    );

    // 2. Update Project (Only if status changed or periodically)
    if (statusChanged) {
        const allEndpoints = await db.collection("endpoints")
            .find({ projectId: endpoint.projectId }).toArray();

        // Calculate this project status based on all endpoints status
        // We might need to refetch the current endpoint status if it wasn't updated in memory?
        // Actually we just updated it in DB, but 'allEndpoints' might fetch the old one if we are not careful or if this is within a transaction (unlikely here).
        // Since we just updated "endpoints", the find() should return updated data.
        // Let's manually overwrite the current one in the array to be safe if read-after-write is delayed (unlikely in Mongo default read preference but possible).

        const updatedAll = allEndpoints.map((e: any) => e.endpointId === endpoint.endpointId ? { ...e, currentStatus: newStatus } : e);

        const downCount = updatedAll.filter((e: any) => e.currentStatus === "DOWN").length;
        let projectStatus: ProjectType['overallStatus'] = "OPERATIONAL";

        if (downCount === updatedAll.length) {
            projectStatus = "MAJOR_OUTAGE";
        } else if (downCount > 0) {
            projectStatus = "PARTIAL_OUTAGE";
        }

        await db.collection("projects").updateOne(
            { projectId: endpoint.projectId },
            { $set: { overallStatus: projectStatus } }
        );
    }

    return JSON.parse(JSON.stringify(log));
}
