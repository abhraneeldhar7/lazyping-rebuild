"use server"

import { getDB } from "@/lib/db";
import { PingLog, ProjectType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { updateProjectStatus } from "./pingActions";
import redis from "@/lib/redis";
import { deserialize, serialize } from "@/lib/utils";
import { Db } from "mongodb";
import { getTierLimits } from "@/lib/pricingTiers";
import { getUserDetails } from "./userActions";

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

    const userDetails = await getUserDetails(userId);
    if (!userDetails) { return { success: false, error: "User not found" } }

    const projects = await getProjects();
    if (projects.length >= getTierLimits(userDetails?.subscriptionTier).max_projects) {
        return { success: false, error: "Max projects reached" }
    }

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

    // Cache: Set project data and add to user's project list
    await redis.set(`project:${newProject.projectId}`, serialize(newProject));
    await redis.sadd(`user:${userId}:projects`, newProject.projectId);


    revalidatePath("/dashboard");
    return JSON.parse(JSON.stringify({ success: true, project: newProject }));
}

/**
 * Fetches all projects for the current Clerk user
 */
export async function getProjects(db?: Db) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    if (!db) db = await getDB();

    // 1. Get Project IDs from Set (Try Cache)
    let projectIds = await redis.smembers(`user:${userId}:projects`);
    let projects: ProjectType[] = [];

    if (projectIds.length > 0) {
        const projectKeys = projectIds.map(id => `project:${id}`);
        const cachedProjects = await redis.mget(projectKeys);
        projects = cachedProjects
            .map(p => deserialize<ProjectType>(p))
            .filter((p): p is ProjectType => p !== null);

        // Sort by createdAt desc (in-memory)
        projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (projects.length !== projectIds.length) {
            projects = []; // mismatch, fetch from DB
        }
    }

    if (projects.length === 0) {
        projects = await db.collection("projects")
            .find({ ownerId: userId }, { projection: { _id: 0 } })
            .sort({ createdAt: -1 })
            .toArray() as ProjectType[] | [];

        // Populate Cache
        if (projects.length > 0) {
            const pipeline = redis.pipeline();
            const ids = projects.map(p => p.projectId);
            pipeline.sadd(`user:${userId}:projects`, ...ids);
            projects.forEach(p => pipeline.set(`project:${p.projectId}`, serialize(p)));
            await pipeline.exec();
        }
    }

    return projects;

}


export async function deleteProject(projectId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();
    const project = await db.collection("projects").findOne({ projectId: projectId, ownerId: userId });
    if (!project) throw new Error("Project not found or unauthorized");

    await db.collection("projects").deleteOne({ projectId: projectId, ownerId: userId });
    await db.collection("endpoints").deleteMany({ projectId: projectId });
    await db.collection("logs").deleteMany({ projectId: projectId });
    await db.collection("public-page").deleteMany({ projectId: projectId });

    // Invalidate Cache
    await redis.del(`project:${projectId}`);
    await redis.srem(`user:${userId}:projects`, projectId);

    // Cleanup endpoints for this project
    const endpointIds = await redis.smembers(`project:${projectId}:endpoints`);
    if (endpointIds.length > 0) {
        const pipeline = redis.pipeline();
        endpointIds.forEach(eid => pipeline.del(`endpoint:${eid}`));
        pipeline.del(`project:${projectId}:endpoints`);
        await pipeline.exec();
    }

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

    // Update Cache
    // We need to fetch the existing generic or just update the field?
    // Let's fetch the cached one to preserve other fields
    const cachedProject: any = await deserialize(await redis.get(`project:${projectData.projectId}`));
    if (cachedProject) {
        cachedProject.projectName = projectData.projectName;
        await redis.set(`project:${projectData.projectId}`, serialize(cachedProject));
    } else {
        // If not in cache, we assume next read will populate it, 
        // OR we can fetch from DB again. Let's leave it to expire/refetch if not present.
    }
    revalidatePath(`/project/${projectData.projectId}`);
}

export async function getProjectDetails(projectId: string) {
    const db = await getDB();

    // Try Cache
    const cachedProject = await deserialize<ProjectType>(await redis.get(`project:${projectId}`));
    if (cachedProject) return cachedProject;

    const project = await db.collection("projects").findOne({ projectId: projectId }, { projection: { _id: 0 } }) as ProjectType | null;

    if (project) {
        await redis.set(`project:${projectId}`, serialize(project));
    }

    return project;
}

export async function getProjectLogs(projectId: string, limit?: number) {
    const db = await getDB();
    const { userId } = await auth().catch(() => ({ userId: null }));

    const project = await db.collection("projects").findOne({ projectId: projectId });
    if (!project) throw new Error("Project not found");

    let query = db.collection("logs").find({ projectId: projectId }, { projection: { _id: 0 } })
        .sort({ timestamp: -1 });

    if (limit) {
        query = query.limit(limit);
    }

    const logs = await query.toArray() as PingLog[] | [];

    const isOwner = userId && userId === project.ownerId;

    if (!isOwner) {
        return logs.map(log => ({
            ...log,
            url: "",
            responseMessage: null,
            errorMessage: null,
            logSummary: ""
        })) as PingLog[];
    }

    return logs;
}

export async function getAllUserProjectLogs() {
    const db = await getDB();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const projects = await getProjects();
    const projectIds = projects.map(project => project.projectId);

    const logs = await db.collection("logs").find({ projectId: { $in: projectIds } }, { projection: { _id: 0 } })
        .sort({ timestamp: -1 })
        .toArray() as PingLog[] | [];

    return JSON.parse(JSON.stringify(logs));
}

export async function pauseProject(projectId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();
    const project = await db.collection("projects").findOne({ projectId: projectId, ownerId: userId });
    if (!project) throw new Error("Unauthorized");

    await db.collection("endpoints").updateMany({ projectId: projectId }, { $set: { enabled: false } });

    // Update Cache for all endpoints
    const endpointIds = await redis.smembers(`project:${projectId}:endpoints`);
    const pipeline = redis.pipeline();
    for (const eid of endpointIds) {
        // We need to read-modify-write technically, but since we know we are setting enabled: false
        // We can try to use a Lua script or just async update.
        // For simplicity: We will just delete the keys to force re-fetch from DB (which is updated)
        // Or better: load, update, save.
        pipeline.get(`endpoint:${eid}`); // This is async inside pipeline... pipeline doesn't work like this for logic.
        // Simple invalidation strategy is best here for bulk updates
        pipeline.del(`endpoint:${eid}`);
    }
    await pipeline.exec();

    await updateProjectStatus(projectId);
    revalidatePath(`/project/${projectId}`);
}