import Link from "next/link";
import { UserPopoverComponent } from "@/components/userPopover";
import Image from "next/image";
import ProjectTabs from "@/components/projectTabs";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { ProjectDataFetcher, ProjectTitleWrapper } from "@/components/project/projectComponents";
import { ProjectTitleSkeleton } from "@/components/loadingSkeletons";
import ProjectLoading from "./loading";

export default async function ProjectLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode,
    params: Promise<{ id: string }>
}>) {

    const projectId = (await params).id;

    return (
        <div className="relative min-h-[100vh] pt-[120px] pb-[50px] overflow-x-hidden">

            <div className="rounded-[50%] w-[100%] h-[18vh] left-[50%] translate-x-[-50%] absolute top-[-15vh] bg-primary dark:bg-primary/80 z-[-1] blur-[50px] animate-pulse" />

            <div className="fixed top-0 bg-background z-[10] w-full border-b-[1px] border-foreground/20 h-[50px] flex items-center p-[5px] px-[10px] gap-[12px]">
                <Link href="/dashboard">
                    <Image src="/appLogo.png" alt="" height={25} width={25} unoptimized />
                </Link>
                <ChevronRight size={15} className="opacity-[0.3]" />
                <Suspense fallback={<ProjectTitleSkeleton />}>
                    <ProjectTitleWrapper projectId={projectId} />
                </Suspense>

                <div className="ml-auto">
                    <UserPopoverComponent />
                </div>
            </div>

            <ProjectTabs projectId={projectId} />

            <Suspense fallback={<ProjectLoading />}>
                <ProjectDataFetcher projectId={projectId}>
                    {children}
                </ProjectDataFetcher>
            </Suspense>
        </div>
    )
}
