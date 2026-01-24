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
            nextPingAt: { $lte: now }
        })
        .toArray()) as unknown as EndpointType[];

    if (dueEndpoints.length === 0) return { processed: 0 };

    const pingPromises = dueEndpoints.map(async (endpoint) => {
        try {
            await pingEndpoint(endpoint, db);
        } catch (error: any) {
            console.error(`[CRON ERROR] Individual ping failed for ${endpoint.endpointName} (${endpoint.endpointId}):`, error.message || error);
        }
    });

    await Promise.all(pingPromises);

    return { processed: dueEndpoints.length };
}