import { getEndpointLogs } from "@/app/actions/endpointActions";
import LogsPageComponent from "@/components/logsComponent";

export default async function LogsPge({ params }: { params: Promise<{ endpointId: string }> }) {
    const param = await params
    const logs = await getEndpointLogs(param.endpointId)
    return (
        <LogsPageComponent logs={logs} />
    )
}