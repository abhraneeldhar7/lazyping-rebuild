"use server"
import { getDB } from "@/lib/db";
import { EndpointType, PingLog, ProjectType, PublicPageType } from "@/lib/types";
import { notFound } from "next/navigation";
import { getProjectDetails, getProjectLogs } from "./projectActions";
import { getEndpoints } from "./endpointActions";

export async function getViewerPublicPageData(slug: string) {
    try {
        const db = await getDB();
        const normalizedSlug = slug.toLowerCase();

        // 1. Fetch public page data
        const publicPage = await db.collection<PublicPageType>("public-page").findOne({
            pageSlug: normalizedSlug,
        });

        if (!publicPage) {
            notFound();
        }

        if (!publicPage.enabled) {
            return { error: "status page is disabled" };
        }

        const projectId = publicPage.projectId;

        // 2. Fetch project data
        const project = await getProjectDetails(projectId)

        // 3. Fetch endpoints
        const endpoints = await getEndpoints(projectId)

        // 4. Fetch logs
        const logs = await getProjectLogs(projectId, 1000)

        // 5. Transform project data (security/privacy)
        const transformedProject = project ? {
            ...project,
            githubIntegration: null
        } : null;

        return JSON.parse(JSON.stringify({
            publicPageData: publicPage,
            projectData: transformedProject,
            endpoints: endpoints,
            logs: logs
        }));
    } catch (error: any) {
        if (error.message === 'NEXT_NOT_FOUND' || error.digest === 'NEXT_NOT_FOUND' || error.message.includes('NEXT_HTTP_ERROR_FALLBACK')) {
            throw error;
        }
        console.error(`Error fetching viewer public page data for slug [${slug}]:`, error);
        return { error: "An unexpected error occurred" };
    }
}
