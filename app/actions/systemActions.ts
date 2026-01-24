"use server"
import { getDB } from "@/lib/db";
import { EndpointType } from "@/lib/types";
import { pingEndpoint } from "./pingActions";

export async function processScheduledPings() {
    const db = await getDB();
    const now = new Date();

    const dueEndpoints = (await db.collection("endpoints")
        .find({
            enabled: true,
            nextPingAt: { $lte: new Date() }
        })
        .toArray()) as unknown as EndpointType[];

    if (dueEndpoints.length === 0) return { processed: 0 };

    let pingedEndpointsLog: string[] = []
    const pingPromises = dueEndpoints.map(async (endpoint) => {
        try {
            const log = await pingEndpoint(endpoint, db);
            pingedEndpointsLog.push(log.url)
        } catch (error: any) {
            console.error(`[CRON ERROR] Individual ping failed for ${endpoint.endpointName} (${endpoint.endpointId}):`, error.message || error);
        }
    });

    await Promise.all(pingPromises);

    return { processed: pingedEndpointsLog.length, pingedEndpointsLog };
}