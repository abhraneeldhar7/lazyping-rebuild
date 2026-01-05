"use client"
import { PingLog } from "@/lib/types";
import { useMemo } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function BarUptime({ logs }: { logs: PingLog[] }) {
    const buckets = useMemo(() => {
        const now = new Date();
        const result = [];
        for (let i = 23; i >= 0; i--) {
            const bucketEnd = new Date(now.getTime() - i * 3600000);
            const bucketStart = new Date(bucketEnd.getTime() - 3600000);

            const logsInBucket = logs.filter(log => {
                const logTime = new Date(log.timestamp).getTime();
                return logTime >= bucketStart.getTime() && logTime < bucketEnd.getTime();
            });

            let status: "UP" | "DOWN" | "NONE" = "NONE";
            if (logsInBucket.length > 0) {
                status = logsInBucket.every(l => l.status === "OK") ? "UP" : "DOWN";
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

    const getColor = (status: "UP" | "DOWN" | "NONE") => {
        if (status === "UP") return "linear-gradient(180deg, #5fffb4ff 0%, #00ff88 50%, #007a3d 100%)";
        if (status === "DOWN") return "linear-gradient(180deg, #ff5858ff 0%, #ff0000 50%, #a70202ff 100%)";
        return "var(--background)";
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-[10px] h-fit w-fit">
                <div className="flex gap-[3px] flex-1 justify-end">
                    {buckets.map((bucket, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <div
                                    className={`rounded-[1px] h-[35px] w-[7px] cursor-pointer ${bucket.status === "NONE" ? "border border-border/30" : ""}`}
                                    style={{
                                        background: getColor(bucket.status)
                                    }}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-[12px]">
                                    <p className="font-medium">
                                        {bucket.status === "UP" ? "Operational" : bucket.status === "DOWN" ? "Outage detected" : "No data"}
                                    </p>
                                    <p className="opacity-70">
                                        {bucket.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {bucket.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {bucket.count > 0 && <p className="opacity-70">{bucket.count} checks</p>}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                <p className="text-[12px] opacity-[0.7] text-center w-full">Last 24 hr</p>
            </div>
        </TooltipProvider>
    )
}
