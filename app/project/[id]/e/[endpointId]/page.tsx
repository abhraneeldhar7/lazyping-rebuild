import { Suspense } from "react";
import { EndpointDetailsSection, EndpointLogsSection } from "@/components/endpoint/endpointComponents";
import { ChartSkeleton, NextPingSkeleton, TableSkeleton } from "@/components/loadingSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default async function EndpointPage({ params }: { params: Promise<{ endpointId: string }> }) {
    const { endpointId } = await params;

    return (
        <div className="flex flex-col gap-[30px]">
            <Suspense fallback={
                <div className="flex flex-col gap-[30px]">
                    <NextPingSkeleton />
                    <div className="flex md:flex-row flex-col gap-[25px] md:justify-between md:items-start">
                        <div className="flex flex-col gap-[20px] flex-1">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-[14px] w-24" />
                                <Skeleton className="h-[18px] w-48" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-[14px] w-24" />
                                <Skeleton className="h-[28px] w-[60%]" />
                            </div>
                        </div>
                    </div>
                </div>
            }>
                <EndpointDetailsSection endpointId={endpointId} />
            </Suspense>

            <Suspense fallback={
                <div className="flex flex-col gap-[30px]">
                    <ChartSkeleton />
                    <TableSkeleton rows={5} cols={3} />
                </div>
            }>
                <EndpointLogsSection endpointId={endpointId} />
            </Suspense>
        </div>
    )
}
