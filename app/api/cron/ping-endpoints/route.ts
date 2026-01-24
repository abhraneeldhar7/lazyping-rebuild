import { processScheduledPings } from "@/app/actions/systemActions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.HUB_CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Await the process to catch batch failures
        const result = await processScheduledPings();

        return NextResponse.json({
            success: true,
            message: "Ping process completed",
            ...result
        });
    } catch (error: any) {
        console.error("Cron batch failure:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}
