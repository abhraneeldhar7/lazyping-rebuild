import { getTotalPingCount } from "@/app/actions/pingActions"
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

const PignsSoFarSkeleton = () => {
    return (<>
        <Skeleton className="w-[80px] h-[15px] rounded-[10px]" />
    </>)
}

export async function PingsSoFar() {
    const totalPings = await getTotalPingCount();
    return (<Suspense fallback={<PignsSoFarSkeleton />}>
        <div className="bg-[var(--success)] h-[7px] w-[7px] rounded-[50%] animate-pulse min-w-[7px]" />
        {totalPings} pings so far
    </Suspense>)
}