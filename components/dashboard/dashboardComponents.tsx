import { getAllUserProjectLogs, getProjects } from "@/app/actions/projectActions";
import { getEndpoints } from "@/app/actions/endpointActions";
import NextPingComponent from "@/components/nextPing";
import Link from "next/link";
import { CheckCircle, ChevronRight, PackageOpen, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProjectCard from "@/components/projectCard";
import NewProjectBtn from "@/components/addProjectBtn";

export async function NextPingWrapper() {
    const projects = await getProjects();
    const endpointsPromises = projects.map(project => getEndpoints(project.projectId));
    const allEndpoints = (await Promise.all(endpointsPromises)).flat();
    return <NextPingComponent endpoints={JSON.parse(JSON.stringify(allEndpoints))} />;
}

export async function LogsSections() {
    const projects = await getProjects();
    const allLogs = await getAllUserProjectLogs();

    const projectMap = projects.reduce((acc: any, proj) => {
        acc[proj.projectId] = proj.projectName;
        return acc;
    }, {});

    const latestLogs: Record<string, any> = {};
    allLogs.forEach((log: any) => {
        if (!latestLogs[log.endpointId]) {
            latestLogs[log.endpointId] = log;
        }
    });

    const alertLogs = Object.values(latestLogs)
        .filter((log: any) => log.status !== "OK" && log.status !== "RESOLVED")
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3);

    const recentLogs = allLogs.slice(0, 3);

    return (
        <div className="flex flex-col gap-[20px] w-full max-w-[400px]">
            <div className="">
                <Label className="pl-[5px]">Alert</Label>
                <div className="rounded-[6px] border border-border/40 w-full mt-[10px] bg-muted dark:bg-muted/30 p-[4px] flex flex-col gap-[4px]">
                    {alertLogs.length > 0 ? (
                        <>
                            {alertLogs.map((log: any, index: number) => (
                                <Link href={`/project/${log.projectId}/e/${log.endpointId}/logs`} key={index} className="h-[50px] rounded-[2px] border border-[var(--error)]/18 bg-[var(--error)]/8 flex items-center px-[10px] text-[14px] gap-[10px] select-none cursor-pointer">
                                    <XCircle size={16} className="text-[var(--error)]" />
                                    <p className="opacity-[0.5] truncate w-[90px]">{projectMap[log.projectId] || "Project"}</p>
                                    <ChevronRight size={14} className="opacity-[0.7]" />
                                    <p className="opacity-[0.9] flex-1 truncate">{log.logSummary}</p>
                                    <p className="opacity-[0.8] text-[12px] pr-[4px]" suppressHydrationWarning>
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: 'numeric' })}
                                    </p>
                                </Link>
                            ))}
                            <Link href="/dashboard/logs">
                                <Button className="w-full h-[34px] text-[12px]" variant="ghost">More</Button>
                            </Link>
                        </>
                    ) : (
                        <div className="h-[100px] bg-[var(--success)]/5 rounded-[4px] flex items-center justify-center border-[2px] border-[var(--success)]/10 gap-[10px]">
                            <p className="text-[14px] leading-[1em]">No alerts so far</p>
                            <CheckCircle size={16} className="text-[var(--success)]" />
                        </div>
                    )}
                </div>
            </div>

            <div className="">
                <Label className="pl-[5px]">Recent</Label>
                <div className="rounded-[6px] border-border/40 border w-full mt-[10px] bg-muted dark:bg-muted/30 text-[14px] p-[4px] flex flex-col gap-[4px]">
                    {recentLogs.length > 0 ? (
                        <>
                            {recentLogs.map((log: any, index: number) => (
                                <Link href={`/project/${log.projectId}/e/${log.endpointId}/logs`} key={index} className={`h-[50px] rounded-[2px] border flex items-center px-[10px] text-[14px] gap-[10px]  select-none cursor-pointer ${log.status === "OK" ? "border-[var(--success)]/18 bg-[var(--success)]/8" : "border-[var(--error)]/18 bg-[var(--error)]/8"}`}>
                                    {log.status === "OK" ? (
                                        <CheckCircle size={16} className="text-[var(--success)]/80" />
                                    ) : (
                                        <XCircle size={16} className="text-[var(--error)]" />
                                    )}
                                    <p className="opacity-[0.7] truncate flex-1">{log.url}</p>
                                    <div>
                                        <p className={`text-[12px] ${log.status === "OK" ? "text-[var(--success)] bg-[var(--success)]/30" : "text-[var(--error)]/90 bg-[var(--error)]/30"} rounded-[10px] leading-[1em] py-[4px] px-[8px]`}>
                                            {log.status === "OK" ? `${log.statusCode} ok` : log.status}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            <Link href="/dashboard/logs">
                                <Button className="w-full h-[34px] text-[12px]" variant="ghost">More</Button>
                            </Link>
                        </>
                    ) : (
                        <div className="h-[100px] opacity-[0.8] rounded-[4px] flex items-center justify-center gap-[10px]">
                            <p className="text-[14px] leading-[1em]">No recent pings</p>
                            <PackageOpen size={18} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export async function ProjectsGrid() {
    const projectsArray = await getProjects();

    return (
        <div className="w-full">
            <Label className="pl-[5px]">Projects</Label>
            <div className="mt-[10px]">
                {projectsArray.length < 1 ? (
                    <div className="flex flex-col items-center justify-center p-[40px] rounded-[10px] border mb-[20px] shadow-sm bg-gradient-to-r from-muted via-background to-muted h-[300px]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-[10px]">
                            <rect x="3" y="7" width="18" height="13" rx="3" fill="currentColor" fillOpacity="0.12" />
                            <rect x="7" y="3" width="10" height="4" rx="2" fill="currentColor" fillOpacity="0.22" />
                            <rect x="9" y="10" width="6" height="2" rx="1" fill="currentColor" />
                        </svg>
                        <p className="text-[14px] mb-[15px] text-muted-foreground opacity-[0.8]">
                            Create your first project to start monitoring.
                        </p>
                        <NewProjectBtn />
                    </div>
                ) : (
                    <div className="flex flex-col gap-[40px]">
                        <div className="grid h-fit md:grid-cols-2 grid-cols-1 gap-[20px] flex-1 items-center">
                            {projectsArray.map((project, index) => (
                                <ProjectCard key={index} project={project} />
                            ))}
                        </div>
                        <div className="mx-auto">
                            <NewProjectBtn />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
