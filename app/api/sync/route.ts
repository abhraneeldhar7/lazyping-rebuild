import { getDB } from "@/lib/db";
import redis from "@/lib/redis";
import { serialize } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Add a secret key check header to prevent unauthorized syncing
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.HUB_CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const db = await getDB();
        const pipeline = redis.pipeline();

        // 1. Sync Projects and User mappings
        const projects = await db.collection("projects").find({}).toArray();
        for (const p of projects) {
            pipeline.set(`project:${p.projectId}`, serialize(p));
            pipeline.sadd(`user:${p.ownerId}:projects`, p.projectId);
        }

        // 2. Sync Endpoints and Project mappings
        const endpoints = await db.collection("endpoints").find({}).toArray();
        for (const e of endpoints) {
            pipeline.set(`endpoint:${e.endpointId}`, serialize(e));
            pipeline.sadd(`project:${e.projectId}:endpoints`, e.endpointId);
        }

        // 3. Sync Public Pages
        // 3. Sync Public Pages
        // We only cache by slug now to save space
        const publicPages = await db.collection("public-page").find({}).toArray();
        for (const pp of publicPages) {
            pipeline.set(`public-page-slug:${pp.pageSlug}`, serialize(pp));
        }

        // 4. Sync Total Ping Count
        const totalPings = await db.collection("logs").estimatedDocumentCount();
        pipeline.set("system:total-pings", totalPings);

        await pipeline.exec();

        return NextResponse.json({
            success: true,
            stats: {
                projects: projects.length,
                endpoints: endpoints.length,
                publicPages: publicPages.length
            }
        });
    } catch (error: any) {
        console.error("Sync failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
