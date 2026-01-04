"use client"
import { PingLog } from "@/lib/types";

export default function BarUptime({ logs }: { logs: PingLog[] }) {


    return (
        <div className="flex flex-col gap-[10px] h-fit">
            <div className="flex gap-[3px] flex-1 justify-end">
                {[...Array(24)].map((_, index) => (
                    <div
                        className="rounded-[1px] h-[35px] w-[7px]"
                        style={{
                            // background: "var(--muted)"
                            background: "linear-gradient(180deg, #5fffb4ff 0%, #00ff88 50%, #007a3d 100%)"
                            // background: "linear-gradient(180deg, #ff5858ff 0%, #ff0000 50%, #a70202ff 100%)"

                        }}
                        key={index}
                    />
                ))}
            </div>
            <p className="text-[12px] opacity-[0.7] text-center w-full">Last 24 hr</p>
        </div>
    )
}
