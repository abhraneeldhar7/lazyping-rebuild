"use client"
import { EndpointType } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function NextPingComponent({ endpoints }: { endpoints: EndpointType[] }) {
    const [now, setNow] = useState<number>(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setNow(Date.now());
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const sortedEndpoints = useMemo(() => {
        if (!endpoints) return [];
        return [...endpoints]
            .filter(e => e.enabled)
            .sort((a, b) => new Date(a.nextPingAt).getTime() - new Date(b.nextPingAt).getTime());
    }, [endpoints]);

    // Find first one that hasn't "fully finished" (ping time + 5s buffer)
    const target = useMemo(() => {
        if (now === 0) return null;
        return sortedEndpoints.find(e => new Date(e.nextPingAt).getTime() + 5000 > now);
    }, [sortedEndpoints, now]);

    const isPinging = useMemo(() => {
        if (!target || now === 0) return false;
        return new Date(target.nextPingAt).getTime() <= now;
    }, [target, now]);

    const timeString = useMemo(() => {
        if (!target || now === 0) return "";
        const diff = new Date(target.nextPingAt).getTime() - now;
        if (diff <= 0) return "00:00s";

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}s`;
    }, [target, now]);

    return (
        <div className="border bg-muted/60 rounded-[5px] md:h-[50px] h-[45px] w-full flex items-center gap-[10px] relative">
            <div className="text-[var(--success)] text-[11px] bg-background absolute top-[-10px] py-[4px] leading-[1em] px-[7px] left-[8px] border rounded-[5px] z-[5]">
                Next ping
            </div>

            <div className="border border-foreground/20 rounded-[5px] absolute bottom-[-5px] left-[30px] right-[30px]" />

            {!mounted || !target ? (
                <div className="flex items-center justify-center w-full h-full">
                    <p className="text-[14px] opacity-[0.7]">{!mounted ? "Loading..." : "No scheduled pings"}</p>
                </div>
            ) : (
                <>
                    <div className="rounded-tl-[5px] rounded-bl-[5px] h-full min-w-[80px] w-[80px] flex items-center justify-center bg-background border-r">
                        <p className="text-[15px] leading-[1em] font-medium">{target.method}</p>
                    </div>

                    <div className="flex items-center flex-1 md:gap-[15px] gap-[6px] p-[6px] pl-[10px] min-w-0">
                        <div className="relative flex-1 h-[1.2em]">
                            <p className="text-[14px] leading-[1.5em] opacity-[0.6] truncate absolute left-0 right-0">{target.url}</p>
                        </div>
                    </div>

                    <div className="p-[3px] h-full">
                        <div
                            className="flex items-center justify-center text-[var(--success)] bg-secondary shadow-md min-w-[70px] w-[70px] md:w-[80px] rounded-[4px] h-full text-[14px] select-none"
                            suppressHydrationWarning
                        >
                            {isPinging ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                                <p>{timeString}</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}