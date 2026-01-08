import { getAllUserProjectLogs } from "@/app/actions/projectActions";
import LogsPageComponent from "@/components/logsComponent";


export default async function DashboardLogsPage() {
    const logs = await getAllUserProjectLogs();
    return (<div>
        <LogsPageComponent logs={logs} />
    </div>)
}