import { ChartNoAxesColumnIncreasing, Server, CheckCircle } from "lucide-react";
import BarUptime from "./barUptime";
import Link from "next/link";
import { ProjectType } from "@/lib/types";
import { getProjectLogs } from "@/app/actions/projectActions";
import { getEndpoints } from "@/app/actions/endpointActions";

export default async function ProjectCard({ project }: { project: ProjectType }) {
    const logs = await getProjectLogs(project.projectId);
    const endpoints = await getEndpoints(project.projectId);

    const avgLatency = endpoints.length > 0
        ? Math.round(endpoints.reduce((acc, e) => acc + (e.latency || 0), 0) / endpoints.length)
        : 0;

    const getStatusInfo = (status: ProjectType["overallStatus"]) => {
        switch (status) {
            case "OPERATIONAL":
                return { label: "Operational", color: "text-[var(--success)]", icon: CheckCircle };
            case "DEGRADED":
                return { label: "Degraded", color: "text-amber-500", icon: CheckCircle };
            case "PARTIAL_OUTAGE":
                return { label: "Partial Outage", color: "text-orange-500", icon: CheckCircle };
            case "MAJOR_OUTAGE":
                return { label: "Major Outage", color: "text-red-500", icon: CheckCircle };
            default:
                return { label: "Unknown", color: "text-muted-foreground", icon: Server };
        }
    };

    const statusInfo = getStatusInfo(project.overallStatus);
    const StatusIcon = statusInfo.icon;

    return (<Link href={`/project/${project?.projectId}`} className="rounded-[10px] border bg-muted p-[10px] h-[180px] flex justify-between flex-col relative overflow-hidden group transition-all duration-300 active:translate-y-[2px] cursor-pointer select-none">

        <div className="rounded-[50%] h-[20px] w-full absolute bg-foreground blur-[60px] bottom-[30%] left-[-50%] rotate-[-40deg] group-hover:translate-x-[50%] group-hover:translate-y-[-50%] transition-all duration-400 ease-in-out animate-pulse" />

        <div className="z-[2] flex flex-col gap-[10px] pl-[5px]">
            <h3 className="text-[18px] truncate max-w-[300px]">{project?.projectName}</h3>
            <p className="opacity-[0.7] text-[14px] flex items-center gap-[5px]">
                <StatusIcon size={14} className={statusInfo.color} />
                {statusInfo.label}
            </p>
            <p className="opacity-[0.7] text-[14px] flex items-center gap-[5px]">
                <Server size={14} />
                {endpoints.length} endpoints active
            </p>
        </div>

        <div className="flex gap-[10px] justify-between items-end z-[2]">
            <p className="pl-[5px] text-[12px] opacity-[0.8] flex gap-[5px] items-center">
                <ChartNoAxesColumnIncreasing size={12} /> {avgLatency}ms
            </p>
            <BarUptime logs={logs} hideLabel hideTooltip />
        </div>
    </Link>)
}