export default async function ProjectLogsPage({ params }: { params: Promise<{ id: string }> }) {
    const param = (await params).id

    return (
        <div>
            <h1>Logs</h1>
        </div>
    )
}