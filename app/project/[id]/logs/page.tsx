import { getProjectLogs } from "@/app/actions/projectActions"
import LogsPageComponent from "@/components/logsComponent"

export default async function ProjectLogsPage({ params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id
    const logs = await getProjectLogs(projectId)
    return (
        <div>
            <LogsPageComponent logs={logs} />
        </div>
    )
}