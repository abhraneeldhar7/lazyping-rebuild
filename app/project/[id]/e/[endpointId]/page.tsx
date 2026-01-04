import { getEndpointDetails, getEndpointLogs } from "@/app/actions/endpointActions";
import BarUptime from "@/components/barUptime";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import NextPingComponent from "@/components/nextPing";
import { Button } from "@/components/ui/button";
import { SettingsIcon, Undo2Icon } from "lucide-react";
import Link from "next/link";

export default async function EndpointPage({ params }: { params: Promise<{ endpointId: string }> }) {
    const { endpointId } = await params;
    const endpointDetails = await getEndpointDetails(endpointId);
    const logs = await getEndpointLogs(endpointId);

    return (
        <div className="flex flex-col gap-[30px]">
            <div className="flex justify-between">
                <Link href={`/project/${endpointDetails.projectId}`} className="w-fit">
                    <Button className="h-[30px] text-[12px]" variant="secondary"><Undo2Icon className="p-[1px]" /> Project</Button>
                </Link>
                <Link href={`/project/${endpointDetails.projectId}/e/${endpointDetails.endpointId}/settings`} className="w-fit">
                    <Button className="h-[30px] text-[12px]"><SettingsIcon className="p-[1px]" /> Settings</Button>
                </Link>
            </div>
            <NextPingComponent />

            {/* <ChartAreaInteractive /> */}
            <div>
                <BarUptime logs={logs} />
            </div>
        </div>
    )
}