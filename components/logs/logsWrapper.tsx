import { getAllUserProjectLogs, getProjectLogs } from "@/app/actions/projectActions";
import { getEndpointLogs } from "@/app/actions/endpointActions";
import LogsPageComponent from "@/components/logsComponent";

export async function DashboardLogsWrapper() {
    const logs = await getAllUserProjectLogs();
    return <LogsPageComponent logs={logs} />;
}

export async function ProjectLogsWrapper({ projectId }: { projectId: string }) {
    const logs = await getProjectLogs(projectId);
    return <LogsPageComponent logs={logs} />;
}

export async function EndpointLogsWrapper({ endpointId }: { endpointId: string }) {
    const logs = await getEndpointLogs(endpointId);
    return <LogsPageComponent logs={logs} />;
}
