import { getEndpointDetails, getEndpointLogs } from "@/app/actions/endpointActions";
import CopyUrl from "@/components/endpoint/copyUrl";
import EndpointEnableToggle from "@/components/endpoint/enableToggle";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import NextPingComponent from "@/components/nextPing";
import { Label } from "@/components/ui/label";
import { EndpointType } from "@/lib/types";
import { CheckIcon, CopyIcon, OctagonAlert, SettingsIcon, Undo2Icon } from "lucide-react";

export default async function EndpointPage({ params }: { params: Promise<{ endpointId: string }> }) {
    const { endpointId } = await params;
    const endpointDetails = await getEndpointDetails(endpointId);
    console.log(endpointDetails)
    const logs = await getEndpointLogs(endpointId);

    return (
        <div className="flex flex-col gap-[30px]">

            <NextPingComponent endpoints={[JSON.parse(JSON.stringify(endpointDetails))]} />


            <div className="flex md:flex-row flex-col gap-[25px] md:justify-between md:items-start">


                <div className="flex flex-col gap-[20px]">
                    <div className="flex flex-col gap-[4px]">
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
                        <div className="rounded-full bg-[#ed0707]/10 border border-[#ed0707]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#ed0707] flex items-center gap-[4px]">
                            Warning <OctagonAlert size={10} />
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

            <div className="">
                <ChartAreaInteractive logs={logs} />
            </div>



        </div>
    )
}