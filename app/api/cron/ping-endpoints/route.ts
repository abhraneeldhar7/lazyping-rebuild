import { processScheduledPings } from "@/app/actions/systemActions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.HUB_CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fire and forget: Do not await this promise
        processScheduledPings().catch((err) => {
            console.error("Background ping process failed:", err);
        });

        // Return immediately to the cron caller
        return NextResponse.json({ success: true, message: "Ping process started in background" });
    } catch (error: any) {
        console.error("Cron trigger failed:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
