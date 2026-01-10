import { ChartSkeleton, NextPingSkeleton, TableSkeleton } from "@/components/loadingSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function EndpointLoading() {
    return (
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
                    <Skeleton className="h-[20px] w-20 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-[14px] w-32" />
                        <Skeleton className="h-[16px] w-24" />
                    </div>
                </div>

                <div className="gap-[10px] md:grid-cols-1 grid-cols-2 grid md:w-[140px] w-full">
                    <Skeleton className="h-[60px] w-full rounded-[8px]" />
                    <Skeleton className="h-[60px] w-full rounded-[8px]" />
                </div>
            </div>

            <div className="">
                <ChartSkeleton />
            </div>

            <div className="flex flex-col gap-[10px] mt-[10px]">
                <Skeleton className="h-[40px] w-full rounded-[6px]" />
                <TableSkeleton rows={5} cols={3} />
            </div>
        </div>
    );
}
