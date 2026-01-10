import { getDB } from "@/lib/db";
import redis from "@/lib/redis";
import { serialize } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Optional: Add a secret key check header to prevent unauthorized syncing
    // const authHeader = req.headers.get("x-sync-secret");
    // if (authHeader !== process.env.SYNC_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
        const publicPages = await db.collection("public-page").find({}).toArray();
        for (const pp of publicPages) {
            pipeline.set(`public-page-id:${pp.projectId}`, serialize(pp));
            pipeline.set(`public-page-slug:${pp.pageSlug}`, serialize(pp));
        }

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
