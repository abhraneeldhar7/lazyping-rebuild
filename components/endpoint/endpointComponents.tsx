import { getEndpointDetails, getEndpointLogs } from "@/app/actions/endpointActions";
import CopyUrl from "@/components/endpoint/copyUrl";
import EndpointEnableToggle from "@/components/endpoint/enableToggle";
import { Label } from "@/components/ui/label";
import { CheckIcon, OctagonAlert, PauseIcon, XIcon } from "lucide-react";
import NextPingComponent from "@/components/nextPing";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import PingEndpoint from "@/components/endpoint/pingEndpoint";
import LogsTable from "@/components/logsTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function EndpointDetailsSection({ endpointId }: { endpointId: string }) {
    const endpointDetails = await getEndpointDetails(endpointId);

    return (
        <>
            <NextPingComponent endpoints={[JSON.parse(JSON.stringify(endpointDetails))]} />

            <div className="flex md:flex-row flex-col gap-[25px] md:justify-between md:items-start">
                <div className="flex flex-col gap-[20px]">
                    <div className="flex flex-col gap-[3px]">
                        <Label>Endpoint Name</Label>
                        <p className="h-[18px] text-[18px]">{endpointDetails.endpointName}</p>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                        <Label>Endpoint url</Label>
                        <div className="flex gap-[10px] items-center">
                            <p className="bg-muted w-fit rounded-[5px] truncate px-[10px] py-[4px] text-[14px]">{endpointDetails.url}</p>
                            <CopyUrl url={endpointDetails.url} />
                        </div>
                    </div>

                    {endpointDetails.currentStatus === "UP" ?
                        <div className="rounded-full bg-[#00ff9e]/10 border border-[#00ff9e]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#00ff9e] flex items-center gap-[4px]">
                            Active <CheckIcon size={10} />
                        </div> :
                        endpointDetails.currentStatus === "DEGRADED" ?
                            <div className="rounded-full bg-[#ffa500]/10 border border-[#ffa500]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#ffa500] flex items-center gap-[4px]">
                                Degraded <OctagonAlert size={10} />
                            </div> :
                            endpointDetails.currentStatus === "MAINTENANCE" ?
                                <div className="rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#3b82f6] flex items-center gap-[4px]">
                                    Maintenance <PauseIcon size={10} />
                                </div> :
                                <div className="rounded-full bg-[#ed0707]/10 border border-[#ed0707]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#ed0707] flex items-center gap-[4px]">
                                    Down <XIcon size={10} />
                                </div>
                    }

                    {endpointDetails.lastPingedAt &&
                        <div className="flex flex-col gap-[2px]">
                            <Label>Last pinged at</Label>
                            <p suppressHydrationWarning> {endpointDetails.lastPingedAt ? new Date(endpointDetails.lastPingedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Never"}</p>
                        </div>
                    }

                    <div className="flex flex-col gap-[7px]">
                        <Label>Enabled</Label>
                        <EndpointEnableToggle endpointDetails={endpointDetails} />
                    </div>
                </div>

                <div className="gap-[10px] md:grid-cols-1 grid-cols-2 grid md:w-[140px] max-w-[400px]">
                    <div className="flex flex-col gap-[2px] items-center p-[6px] pt-[8px] border dark:bg-muted/20 rounded-[8px] flex-1 gap-[6px]">
                        <Label className="text-[12px]">Ping Interval</Label>
                        <div className="text-[14px] bg-foreground/10 rounded-[3px] w-full flex items-center justify-center h-[30px]">{endpointDetails.intervalMinutes} m</div>
                    </div>
                    <div className="flex flex-col gap-[2px] items-center p-[6px] pt-[8px] border dark:bg-muted/20 rounded-[8px] flex-1 gap-[6px]">
                        <Label className="text-[12px]">Latency</Label>
                        <div className="text-[14px] bg-foreground/10 rounded-[3px] w-full flex items-center justify-center h-[30px]">{endpointDetails.latency} {endpointDetails.latency ? "ms" : ""}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function EndpointLogsSection({ endpointId }: { endpointId: string }) {
    const logs = await getEndpointLogs(endpointId);
    const endpointDetails = await getEndpointDetails(endpointId); // Needed for projectId

    return (
        <div className="flex flex-col gap-[30px]">
            <div>
                <ChartAreaInteractive logs={logs} />
            </div>

            <div className="flex flex-col gap-[10px] mt-[10px]">
                <PingEndpoint id={endpointId} />
                <LogsTable logsData={logs.slice(0, 5)} />
                <Link href={`/project/${endpointDetails.projectId}/e/${endpointId}/logs`} className="md:w-fit w-full mx-auto mt-[10px]">
                    <Button variant="ghost">See all endpoint logs</Button>
                </Link>
            </div>
        </div>
    );
}
