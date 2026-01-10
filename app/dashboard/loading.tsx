import { NextPingSkeleton, ProjectsGridSkeleton, SidebarSectionSkeleton } from "@/components/loadingSkeletons";

export default function DashboardLoading() {
    return (
        <div className="pt-[15px] pb-[30px]">
            <NextPingSkeleton />

            <div className="flex md:flex-row flex-col md:gap-[30px] gap-[20px] mt-[30px]">
                <div className="flex flex-col gap-[20px] w-full max-w-[400px]">
                    <SidebarSectionSkeleton label="Alert" />
                    <SidebarSectionSkeleton label="Recent" />
                </div>

                <ProjectsGridSkeleton />
            </div>
        </div>
    );
}
