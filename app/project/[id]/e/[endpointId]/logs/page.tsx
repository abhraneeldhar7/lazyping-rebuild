import { Suspense } from "react";
import { EndpointLogsWrapper } from "@/components/logs/logsWrapper";
import { LogsPageSkeleton } from "@/components/loadingSkeletons";

export default async function LogsPge({ params }: { params: Promise<{ endpointId: string }> }) {
    const { endpointId } = await params;

    return (
        <Suspense fallback={<LogsPageSkeleton />}>
            <EndpointLogsWrapper endpointId={endpointId} />
        </Suspense>
    )
}