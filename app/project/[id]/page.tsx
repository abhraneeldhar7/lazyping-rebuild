"use client"
import AddEndpointBtn from "@/components/addEndpoint";
import BarUptime from "@/components/barUptime";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import { useProject } from "@/components/projectContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRightFromLine, CheckIcon, DownloadIcon, Github, LoaderCircle, OctagonAlert, PauseIcon, RssIcon, StickerIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import NextPingComponent from "@/components/nextPing";
import { AutoRefresh } from "@/components/autoRefresh";
import { pingEndpoint } from "@/app/actions/pingActions";
import { toast } from "sonner";
import { useState } from "react";

export default function ProjectPage() {
    const { projectData, endpoints, logs } = useProject();
    const router = useRouter();
    const [pingLoading, setPingLoading] = useState(false);

    const avgLatency = endpoints.length > 0
        ? Math.round(endpoints.reduce((acc, e) => acc + (e.latency || 0), 0) / endpoints.length)
        : 0;

    const avgInterval = endpoints.length > 0
        ? Math.round(endpoints.reduce((acc, e) => acc + (e.intervalMinutes || 0), 0) / endpoints.length)
        : 5;

    const getStatusLabel = (status: string | null) => {
        switch (status) {
            case "OPERATIONAL": return "Operational";
            case "PARTIAL_OUTAGE": return "Partial Outage";
            case "MAJOR_OUTAGE": return "Major Outage";
            case "DEGRADED": return "Performance Degraded";
            default: return "Unknown";
        }
    };

    const briefStats = [
        { label: "Status", value: getStatusLabel(projectData.overallStatus) },
        { label: "Endpoints", value: `${endpoints.filter(e => e.enabled).length} Active` },
        { label: "Avg Latency", value: `${avgLatency} ms` },
        { label: "Interval", value: `${avgInterval} m` },
    ]

    const handlePingAll = async () => {
        if (pingLoading) return;
        setPingLoading(true);

        const activeEndpoints = endpoints.filter(e => e.enabled);
        if (activeEndpoints.length === 0) {
            toast.error("No active endpoints to ping");
            setPingLoading(false);
            return;
        }

        const promise = (async () => {
            for (const endpoint of activeEndpoints) {
                await pingEndpoint(endpoint.endpointId);
            }
            router.refresh();
        })();

        toast.promise(promise, {
            success: 'All endpoints pinged',
            error: 'Failed to ping all endpoints',
        });

        try {
            await promise;
        } catch (e) {
            console.error(e);
        } finally {
            setPingLoading(false);
        }
    };

    const handleExport = () => {
        const data = {
            project: projectData,
            endpoints: endpoints,
            logs: logs
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectData.projectName.replace(/\s+/g, '_')}_export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Data exported successfully");
    };

    const FancyStatCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        return (
            <div className={cn("flex flex-col gap-[8px] md:flex-1 bg-muted/40 border border-border/40 hover:border-primary/20 transition-all duration-200 hover:shadow-sm rounded-[10px] px-[15px] py-[10px] min-h-[150px] md:h-[180px] overflow-hidden relative group", className)}>
                {children}
                <div className="h-[30px] transition-all duration-300 group-hover:blur-[32px] group-hover:h-[30px] group-hover:w-[140%] rounded-[50%] blur-[40px] w-[110%] left-[50%] translate-x-[-50%] bottom-0 absolute translate-y-[50%] bg-primary z-[-1] opacity-[0.4]" />
            </div>
        )
    }

    return (
        <>
            <NextPingComponent endpoints={endpoints} />
            <AutoRefresh />

            <div className="flex mb-[30px] md:flex-row flex-col gap-[30px] mt-[25px]">
                <div className="flex-1">
                    <p className="opacity-[0.7] text-[14px]">Project name</p>
                    <h1 className="text-[22px] truncate ">{projectData?.projectName}</h1>
                </div>

                <div className="flex-1 flex flex-col items-center md:items-end gap-[10px] mt-[15px]">
                    <BarUptime logs={logs} />
                </div>
            </div>

            <div className="flex my-[40px] md:flex-row flex-col gap-[25px] justify-between">
                <FancyStatCard>
                    <h1 className="mb-auto text-[16px] font-medium">Project Stats</h1>
                    {briefStats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between gap-[10px]">
                            <h1 className="text-[12px] opacity-[0.7]">{stat.label}</h1>
                            <p className="text-[14px] font-medium">{stat.value}</p>
                        </div>
                    ))}
                </FancyStatCard>

                <FancyStatCard className="p-[10px]">
                    <div className="mb-auto px-[5px]">
                        <h1 className="text-[16px] font-medium">Quick Actions</h1>
                        <p className="opacity-[0.7] text-[14px]">Manual check all active endpoints</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pingLoading}
                        onClick={handlePingAll}
                        className="w-full ml-auto h-[40px]"
                    >
                        {pingLoading ? <LoaderCircle className="animate-spin" /> : <RssIcon size={16} />}
                        Ping All
                    </Button>
                </FancyStatCard>

                <FancyStatCard className="p-[10px]">
                    <div className="mb-auto px-[5px]">
                        <h1 className="text-[16px] font-medium">Export data</h1>
                        <p className="opacity-[0.7] text-[14px]">Download project logs and config in JSON format</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleExport}
                        className="w-full text-right h-[40px]"
                    >
                        Export
                        <ArrowRightFromLine />
                    </Button>
                </FancyStatCard>
            </div>

            {logs.length > 0 &&
                <div className="my-[70px]">
                    <ChartAreaInteractive logs={logs} />
                </div>
            }

            <div className="flex flex-col gap-[25px] items-center">
                {endpoints.length > 0 ? (
                    <div className="w-full overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="text-[12px] opacity-[0.7]">
                                    <TableHead className="">Endpoint</TableHead>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead className="w-[100px]">Latency</TableHead>
                                    <TableHead className="w-[150px]">Last Checked</TableHead>
                                    <TableHead className="w-[100px]">Interval</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {endpoints.map((endpoint, index) => (
                                    <TableRow className="cursor-pointer select-none hover:bg-muted/50 border-0" key={index} onClick={() => {
                                        router.push(`/project/${projectData.projectId}/e/${endpoint.endpointId}`)
                                    }}>
                                        <TableCell>
                                            <div className="relative overflow-hidden truncate text-[14px]">
                                                {endpoint.url}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {endpoint.currentStatus === "UP" ?
                                                <div className="rounded-full bg-[#00ff9e]/10 border border-[#00ff9e]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#00ff9e] flex items-center gap-[4px]">
                                                    Active <CheckIcon size={10} />
                                                </div> :
                                                <div className="rounded-full bg-[#ed0707]/10 border border-[#ed0707]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#ed0707] flex items-center gap-[4px]">
                                                    Warning <OctagonAlert size={10} />
                                                </div>
                                            }
                                        </TableCell>
                                        <TableCell className="text-[13px] opacity-80">
                                            {endpoint.latency ? `${endpoint.latency}ms` : ""}
                                            {!endpoint.latency && <XIcon size={12} />}
                                        </TableCell>
                                        <TableCell className="text-[13px] opacity-80">
                                            {endpoint.lastPingedAt ? new Date(endpoint.lastPingedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Never"}
                                        </TableCell>
                                        <TableCell className="text-[13px] opacity-80">{endpoint.intervalMinutes}m</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-[15px] bg-muted/40 px-[15px] py-[50px] w-full rounded-[8px] border cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => (document.querySelector('[data-add-endpoint]') as HTMLElement)?.click()}>
                        <StickerIcon size={30} className="opacity-40" />
                        <div className="text-center flex flex-col gap-[5px]">
                            <p className="font-medium">No endpoints added for this project</p>
                            <p className="opacity-[0.7] font-[300] text-[14px]">Click to add your first endpoint and start monitoring</p>
                        </div>
                    </div>
                )}

                <AddEndpointBtn projectId={projectData.projectId} />

            </div>
        </>
    )
}
