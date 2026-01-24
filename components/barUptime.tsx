"use client"
import { PingLog } from "@/lib/types";
import { useMemo } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function BarUptime({ logs, hideLabel = false, hideTooltip = false }: { logs: PingLog[], hideLabel?: boolean, hideTooltip?: boolean }) {
    const buckets = useMemo(() => {
        const now = new Date();
        const result = [];

        // Create 24 buckets, each representing 1 hour
        // Start from 24 hours ago and go to now
        const startTime = new Date(now.getTime() - 24 * 3600000); // 24 hours ago

        for (let i = 0; i < 24; i++) {
            const bucketStart = new Date(startTime.getTime() + i * 3600000);
            const bucketEnd = new Date(bucketStart.getTime() + 3600000);

            const logsInBucket = logs.filter(log => {
                const logTime = new Date(log.timestamp).getTime();
                return logTime >= bucketStart.getTime() && logTime < bucketEnd.getTime();
            });

            let status: "UP" | "DOWN" | "DEGRADED" | "NONE" = "NONE";
            if (logsInBucket.length > 0) {
                const allOk = logsInBucket.every(l => l.status === "OK");
                const someOk = logsInBucket.some(l => l.status === "OK");

                if (allOk) {
                    status = "UP";
                } else if (someOk) {
                    status = "DEGRADED";
                } else {
                    status = "DOWN";
                }
            }

            result.push({
                start: bucketStart,
                end: bucketEnd,
                status,
                count: logsInBucket.length
            });
        }

        return result;
    }, [logs]);

    const getColor = (status: "UP" | "DOWN" | "DEGRADED" | "NONE") => {
        if (status === "UP") return "linear-gradient(180deg, #5fffb4ff 0%, #00ff88 50%, #007a3d 100%)";
        if (status === "DEGRADED") return "linear-gradient(180deg, #fff25fff 0%, #ffd000 50%, #7a6a00 100%)";
        if (status === "DOWN") return "linear-gradient(180deg, #ff5858ff 0%, #ff0000 50%, #a70202ff 100%)";
        return "var(--muted)";
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-[10px] h-fit w-fit">
                <div className="flex gap-[3px] flex-1 justify-end">
                    {buckets.map((bucket, index) => {
                        const Bar = (
                            <div
                                className={`rounded-[1px] h-[35px] w-[7px] cursor-pointer ${bucket.status === "NONE" ? "border border-border/30" : ""}`}
                                style={{
                                    background: getColor(bucket.status)
                                }}
                            />
                        );

                        if (hideTooltip) return <div key={index}>{Bar}</div>;

                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    {Bar}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-[12px]">
                                        <p className="font-medium">
                                            {bucket.status === "UP" ? "Operational" : bucket.status === "DEGRADED" ? "Degraded performance" : bucket.status === "DOWN" ? "Outage detected" : "No data"}
                                        </p>
                                        <p className="opacity-70 mt-1">
                                            {bucket.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {bucket.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        {bucket.count > 0 && <p className="opacity-70">{bucket.count} checks</p>}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </div>
                {!hideLabel &&
                    <p className="text-[12px] opacity-[0.7] text-center w-full">Last 24 hr</p>
                }
            </div>
        </TooltipProvider>
    )
}
