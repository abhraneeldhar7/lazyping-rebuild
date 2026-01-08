"use client"
import { PingLog, ProjectType } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile";
import { getProjects } from "@/app/actions/projectActions";
import LogsTable from "./logsTable";
import { GithubIntegartionPrompt } from "./githubIntegrationPrompt";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { LayoutGridIcon, ListFilter, OctagonAlertIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

export const mockLogsData: PingLog[] = []

export default function LogsPageComponent({ logs }: { logs: PingLog[] }) {
    const [filterOption, setFilterOption] = useState<"all" | "alerts">("all");
    const [displayLogs, setDisplayLogs] = useState(logs);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | "all">("all");

    useEffect(() => {
        const uniqueProjectIds = Array.from(new Set(logs.map(log => log.projectId)));
        if (uniqueProjectIds.length > 1) {
            const fetchProjects = async () => {
                try {
                    const allProjects = await getProjects();
                    const relevantProjects = allProjects.filter((p: ProjectType) => uniqueProjectIds.includes(p.projectId));
                    setProjects(relevantProjects);
                } catch (error) {
                    console.error("Failed to fetch projects:", error);
                }
            };
            fetchProjects();
        } else {
            setProjects([]);
            setSelectedProjectId("all");
        }
    }, [logs]);

    useEffect(() => {
        let filtered = logs;
        if (filterOption === "alerts") {
            filtered = filtered.filter(log => log.status !== "OK");
        }
        if (selectedProjectId !== "all") {
            filtered = filtered.filter(log => log.projectId === selectedProjectId);
        }
        setDisplayLogs(filtered);
    }, [filterOption, selectedProjectId, logs]);


    return (
        <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[10px]">
                {projects.length > 1 &&
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-[30px] w-[30px]"><ListFilter className="p-[1px]" /></Button>
                        </PopoverTrigger>
                        <PopoverContent className="flex flex-col gap-[4px] p-[4px] w-[140px]">
                            <PopoverClose asChild>
                                <Button
                                    variant={selectedProjectId === "all" ? "secondary" : "ghost"}
                                    className="text-[12px] h-[30px] whitespace-nowrap flex justify-start"
                                    onClick={() => setSelectedProjectId("all")}
                                >
                                    <LayoutGridIcon className="p-[1px]" />
                                    All
                                </Button>
                            </PopoverClose>
                            {projects.map(project => (
                                <PopoverClose asChild key={project.projectId}>
                                    <Button
                                        variant={selectedProjectId === project.projectId ? "secondary" : "ghost"}
                                        className="text-[12px] flex justify-start h-[30px] whitespace-nowrap"
                                        onClick={() => setSelectedProjectId(project.projectId)}
                                    >
                                        {project.projectName}
                                    </Button>
                                </PopoverClose>
                            ))}
                        </PopoverContent>
                    </Popover>
                }

                <Button variant={filterOption === "all" ? "outline" : "ghost"} className="text-[12px] h-[30px]" onClick={() => setFilterOption("all")}>All</Button>
                <Button variant={filterOption === "alerts" ? "outline" : "ghost"} className="text-[12px] h-[30px] leading-[1em] text-destructive hover:text-destructive/80" onClick={() => setFilterOption("alerts")}><OctagonAlertIcon className="p-[1px]" /> Alerts</Button>

            </div>
            <LogsTable logsData={displayLogs} />
        </div >
    )
}