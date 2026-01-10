import { Suspense } from "react";
import { ProjectLogsWrapper } from "@/components/logs/logsWrapper";
import { LogsPageSkeleton } from "@/components/loadingSkeletons";

export default async function ProjectLogsPage({ params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id

    return (
        <div>
            <Suspense fallback={<LogsPageSkeleton />}>
                <ProjectLogsWrapper projectId={projectId} />
            </Suspense>
        </div>
    )
}