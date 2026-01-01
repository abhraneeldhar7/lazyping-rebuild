import { ChartNoAxesColumnIncreasing, Server, CheckCircle } from "lucide-react";
import BarUptime from "./barUptime";
import Link from "next/link";

export default function ProjectCard() {
    return (<Link href="/project/123" className="rounded-[10px] border bg-muted p-[10px] h-[180px] flex justify-between flex-col relative overflow-hidden group transition-all duration-300 active:translate-y-[2px] cursor-pointer select-none">

        <div className="rounded-[50%] h-[20px] w-full absolute bg-foreground blur-[60px] bottom-[30%] left-[-50%] rotate-[-40deg] group-hover:translate-x-[50%] group-hover:translate-y-[-50%] transition-all duration-400 ease-in-out animate-pulse" />

        <div className="z-[2] flex flex-col gap-[10px] pl-[5px]">
            <h3 className="text-[18px] truncate max-w-[300px]">Project name</h3>
            <p className="opacity-[0.7] text-[14px] flex items-center gap-[5px]">
                <CheckCircle size={14} className="text-[var(--success)]" />
                Active
            </p>
            <p className="opacity-[0.7] text-[14px] flex items-center gap-[5px]">
                <Server size={14} />
                5 endpoints active
            </p>
        </div>

        <div className="flex gap-[10px] justify-between items-end z-[2]">
            <p className="pl-[5px] text-[12px] opacity-[0.8] flex gap-[5px] items-center"><ChartNoAxesColumnIncreasing size={12} /> 200ms</p>
            <BarUptime />
        </div>
    </Link>)
}