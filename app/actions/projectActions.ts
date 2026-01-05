"use server"

import { getDB } from "@/lib/db";
import { PingLog, ProjectType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function createProject(data: {
    projectName: string;
    githubIntegration: {
        githubRepoId: number;
        githubRepoName: string;
        installationId: number;
    } | null
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();

    const newProject: ProjectType = {
        projectId: uuidv4(),
        projectName: data.projectName,
        ownerId: userId,
        overallStatus: null,
        createdAt: new Date(),
        githubIntegration: data.githubIntegration
    };

    await db.collection("projects").insertOne(newProject);

    revalidatePath("/dashboard");
    return JSON.parse(JSON.stringify({ success: true, project: newProject }));
}

/**
 * Fetches all projects for the current Clerk user
 */
export async function getProjects() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();
    const projects = await db.collection("projects")
        .find({ ownerId: userId }, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray() as ProjectType[] | [];

    return projects;

}


export async function deleteProject(projectId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();
    await db.collection("projects").deleteOne({ projectId: projectId, ownerId: userId });
    await db.collection("endpoints").deleteMany({ projectId: projectId });
    await db.collection("logs").deleteMany({ projectId: projectId });
    revalidatePath("/dashboard");
}

export async function saveProject(projectData: ProjectType) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();
    await db.collection("projects").updateOne({ projectId: projectData.projectId, ownerId: userId }, {
        $set: {
            projectName: projectData.projectName
        }
    });
    revalidatePath(`/project/${projectData.projectId}`);
}

export async function getProjectDetails(projectId: string) {
    const db = await getDB();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const project = await db.collection("projects").findOne({ projectId: projectId, ownerId: userId }, { projection: { _id: 0 } }) as ProjectType | null;
    return project;
}

export async function getProjectLogs(projectId: string) {
    const db = await getDB();
    const logs = await db.collection("logs").find({ projectId: projectId }, { projection: { _id: 0 } })
        .sort({ timestamp: -1 })
        .toArray() as PingLog[] | [];
    return logs;
}