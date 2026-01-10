import { getProjectDetails, getProjectLogs } from "@/app/actions/projectActions";
import { getEndpoints } from "@/app/actions/endpointActions";
import ProjectTitle from "@/components/projectTitle";
import { ProjectContextProvider } from "@/components/projectContext";
import { notFound } from "next/navigation";

export async function ProjectTitleWrapper({ projectId }: { projectId: string }) {
    const [projectDetails, endpoints] = await Promise.all([
        getProjectDetails(projectId),
        getEndpoints(projectId)
    ]);
    if (!projectDetails) return null;
    return <ProjectTitle projectName={projectDetails.projectName} endpoints={endpoints} />;
}

export async function ProjectDataFetcher({ projectId, children }: { projectId: string, children: React.ReactNode }) {
    const [projectDetails, endpoints, projectLogs] = await Promise.all([
        getProjectDetails(projectId),
        getEndpoints(projectId),
        getProjectLogs(projectId)
    ]);

    if (!projectDetails) return notFound();

    return (
        <ProjectContextProvider projectData={projectDetails} endpoints={endpoints} logs={projectLogs}>
            <div className="mx-auto max-w-[1000px] px-[15px]">
                {children}
            </div>
        </ProjectContextProvider>
    );
}
