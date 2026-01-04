
import { ProjectContextProvider } from "@/components/projectContext";
import { getProjectDetails, getProjectLogs } from "@/app/actions/projectActions";
import Link from "next/link";
import { UserPopoverComponent } from "@/components/userPopover";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProjectTitle from "@/components/projectTitle";
import { getEndpoints } from "@/app/actions/endpointActions";
import { notFound } from "next/navigation";

export default async function ProjectLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode,
    params: Promise<{ id: string }>
}>) {

    const projectId = (await params).id;

    try {
        const [projectDetails, endpoints, projectLogs] = await Promise.all([
            getProjectDetails(projectId),
            getEndpoints(projectId),
            getProjectLogs(projectId)
        ]);

        if (!projectDetails) return notFound();

        const projectTabs = [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Overview", href: `/project/${projectId}` },
            { label: "Logs", href: `/project/${projectId}/logs` },
            { label: "Settings", href: `/project/${projectId}/settings` },
        ]

        return (
            <div className="relative min-h-[100vh] pt-[120px] pb-[50px] overflow-x-hidden">

                <div className="rounded-[50%] w-[120%] h-[20vh] left-[50%] translate-x-[-50%] absolute top-[-15vh] bg-accent z-[-1] opacity-[0.4] blur-[70px] animate-pulse" />


                <div className="fixed top-0 bg-background z-[10] w-full border-b-[1px] border-foreground/20 h-[50px] flex items-center p-[5px] px-[10px] gap-[15px]">
                    <Link href="/dashboard">
                        <Image src="/appLogo.png" alt="" height={30} width={30} unoptimized />
                    </Link>
                    {projectDetails &&
                        <ProjectTitle projectName={projectDetails?.projectName} />
                    }
                    {/* <div className="flex gap-[10px] items-center">
                    <ChevronRight size={14} className="opacity-[0.3]" />
                    <p className="text-[15px]">{projectDetails?.projectName}</p>
                    <NetworkIcon size={16} />
                </div> */}
                    <div className="ml-auto">
                        <UserPopoverComponent />
                    </div>
                </div>


                <div className="fixed flex px-[15px] items-center top-[50px] h-[40px] backdrop-blur-[20px] bg-background/50 w-full z-[10]">
                    {projectTabs.map((tab, index) => (
                        <Link key={index} href={tab.href}>
                            <Button variant="ghost" className={`font-[400] rounded-[4px] h-[30px] text-[12px]`}>{tab.label}</Button>
                        </Link>
                    ))}
                </div>
                <ProjectContextProvider projectData={projectDetails} endpoints={endpoints} logs={projectLogs}  >
                    <div className="mx-auto max-w-[1000px] px-[15px]">
                        {children}
                    </div>
                </ProjectContextProvider>
            </div>

        )

    } catch (e) {
        return notFound();
    }

}
