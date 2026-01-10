import { NextPingSkeleton, ProjectsGridSkeleton, SidebarSectionSkeleton } from "@/components/loadingSkeletons";
import { AutoRefresh } from "@/components/autoRefresh";
import { Suspense } from "react";
import { LogsSections, NextPingWrapper, ProjectsGrid } from "@/components/dashboard/dashboardComponents";

export default async function Dashboard() {
    return (
        <div className="pt-[15px] pb-[30px]">
            <AutoRefresh />

            <Suspense fallback={<NextPingSkeleton />}>
                <NextPingWrapper />
            </Suspense>

            <div className="flex md:flex-row flex-col md:gap-[30px] gap-[20px] mt-[30px]">
                <Suspense fallback={
                    <div className="flex flex-col gap-[20px] w-full max-w-[400px]">
                        <SidebarSectionSkeleton label="Alert" />
                        <SidebarSectionSkeleton label="Recent" />
                    </div>
                }>
                    <LogsSections />
                </Suspense>

                <Suspense fallback={<ProjectsGridSkeleton />}>
                    <ProjectsGrid />
                </Suspense>
            </div>
        </div>)
}
