"use server"

import { getDB } from "@/lib/db";
import { pingEndpoint } from "./pingActions";
// import { PingLog, ProjectType } from "@/lib/types";
// import { Db } from "mongodb";

export async function processScheduledPings() {
    const db = await getDB();
    const now = new Date(); // Use Date object for comparison if stored as Date in DB

    const dueEndpoints = await db.collection("endpoints")
        .find({
            enabled: true,
            // nextPingAt: { $lte: now }
        })
        .toArray();

    if (dueEndpoints.length === 0) return { processed: 0 };

    // Process pings in parallel (or limit concurrency if needed for large scale)
    const pingPromises = dueEndpoints.map(async (endpoint) => {
        try {
            // @ts-ignore
            await pingEndpoint(endpoint, db);
        } catch (error) {
            console.error(`Failed to process ping for ${endpoint.endpointId}:`, error);
        }
    });

    await Promise.all(pingPromises);

    return { processed: dueEndpoints.length };
}