import { getDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.HUB_CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = await getDB();

        // Calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await db.collection("logs").deleteMany({
            timestamp: { $lt: thirtyDaysAgo }
        });

        console.log(`[Cleanup] Deleted ${result.deletedCount} logs older than 30 days.`);

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount,
            message: `Deleted ${result.deletedCount} logs older than ${thirtyDaysAgo.toISOString()}`
        });

    } catch (error: any) {
        console.error("Cleanup failed:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
