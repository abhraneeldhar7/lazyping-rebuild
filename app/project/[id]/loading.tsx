import { ChartSkeleton, NextPingSkeleton, StatCardSkeleton, TableSkeleton } from "@/components/loadingSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
    return (
        <div className="mx-auto max-w-[1000px] px-[15px]">
            <NextPingSkeleton />

            <div className="flex mb-[30px] md:flex-row flex-col gap-[30px] mt-[25px]">
                <div className="flex-1">
                    <Skeleton className="h-[14px] w-24 mb-2" />
                    <Skeleton className="h-[22px] w-48" />
                </div>
                <div className="flex-1 flex flex-col items-center md:items-end mt-[15px]">
                    <Skeleton className="h-[40px] w-full max-w-[400px]" />
                </div>
            </div>

            <div className="flex my-[40px] md:flex-row flex-col gap-[25px] justify-between">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            <div className="my-[70px]">
                <ChartSkeleton />
            </div>

            <div className="flex flex-col gap-[25px] items-center">
                <TableSkeleton rows={5} cols={5} />
            </div>
        </div>
    );
}
