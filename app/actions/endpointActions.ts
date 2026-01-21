"use server"

import { getDB } from "@/lib/db";
import { EndpointType, methodType, PingLog } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { pingEndpoint, updateProjectStatus } from "./pingActions";
import redis from "@/lib/redis";
import { deserialize, serialize } from "@/lib/utils";


export async function createEndpoint(data: {
    url: string;
    name: string;
    method: methodType;
    intervalMinutes: number;
    expectedResponse: string;
    body: string | null;
    projectId: string;
    headers: Record<string, string> | null;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();

    const userCheck = (await getDB()).collection("projects").findOne({ projectId: data.projectId, ownerId: userId })
    if (!userCheck) throw new Error("Unauthorized");

    const newEndpoint: EndpointType = {
        projectId: data.projectId,
        endpointId: uuidv4(),
        url: data.url,
        endpointName: data.name,
        method: data.method,
        intervalMinutes: data.intervalMinutes,
        expectedResponse: data.expectedResponse,
        enabled: true,
        currentStatus: "UP",
        consecutiveFailures: 0,
        lastPingedAt: null,
        headers: data.headers,
        body: data.body,
        latency: null,
        nextPingAt: new Date(),
        lastStatusChange: new Date(),
    };

    await db.collection("endpoints").insertOne(newEndpoint);

    // Cache: Set endpoint data and add to project's endpoint list
    await redis.set(`endpoint:${newEndpoint.endpointId}`, serialize(newEndpoint));
    await redis.sadd(`project:${data.projectId}:endpoints`, newEndpoint.endpointId);

    await pingEndpoint(newEndpoint.endpointId)
    await updateProjectStatus(data.projectId);
    revalidatePath(`/project/${data.projectId}`);
    return (newEndpoint.endpointId)
}


export async function getEndpoints(projectId: string) {
    const db = await getDB();
    const { userId } = await auth().catch(() => ({ userId: null }));

    // 1. Get Project (Try Cache)
    let project: any = await deserialize(await redis.get(`project:${projectId}`));
    if (!project) {
        project = await db.collection("projects").findOne({ projectId: projectId });
        if (project) await redis.set(`project:${projectId}`, serialize(project));
    }

    if (!project) throw new Error("Project not found");

    // 2. Get Endpoint IDs from Set (Try Cache)
    let endpointIds = await redis.smembers(`project:${projectId}:endpoints`);
    let endpoints: EndpointType[] = [];

    if (endpointIds.length > 0) {
        // Fetch values
        const endpointKeys = endpointIds.map(id => `endpoint:${id}`);
        // MGET returns (string | null)[]
        const cachedEndpoints = await redis.mget(endpointKeys);

        // Deserialize and filter out nulls
        endpoints = cachedEndpoints
            .map(e => deserialize<EndpointType>(e))
            .filter((e): e is EndpointType => e !== null);

        // If we found fewer endpoints than IDs (cache miss/eviction), fall back to DB or just fill gaps?
        // Fallback to DB is safest for consistency if counts mismatch significantly, 
        // but for now let's assume if IDs exist, we trust them or if null, we re-fetch all to heal.
        if (endpoints.length !== endpointIds.length) {
            // Cache likely inconsistent/evicted. Fetch all from DB.
            endpoints = []; // trigger DB fetch
        }
    }

    if (endpoints.length === 0) {
        // Cache miss or empty
        endpoints = await db.collection<EndpointType>("endpoints")
            .find({ projectId: projectId }, { projection: { _id: 0 } })
            .toArray();

        // Populate Cache
        if (endpoints.length > 0) {
            const pipeline = redis.pipeline();
            const ids = endpoints.map(e => e.endpointId);
            pipeline.sadd(`project:${projectId}:endpoints`, ...ids);
            endpoints.forEach(e => pipeline.set(`endpoint:${e.endpointId}`, serialize(e)));
            await pipeline.exec();
        }
    }

    const isOwner = userId && userId === project.ownerId;

    if (!isOwner) {
        return endpoints.map(e => ({
            ...e,
            url: "",
            expectedResponse: null,
            headers: null,
            body: null
        })) as EndpointType[];
    }

    return endpoints;
}


export async function getEndpointLogs(endpointId: string) {
    const db = await getDB();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const endpoint = await db.collection("endpoints").findOne({ endpointId: endpointId })
    if (!endpoint) throw new Error("Unauthorized");

    return await db.collection<PingLog>("logs").find({ endpointId: endpointId }, { projection: { _id: 0 } }).sort({ timestamp: -1 }).limit(100).toArray();
}


export async function updateEndpoint(data: EndpointType) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();

    const endpoint = await db.collection<EndpointType>("endpoints").findOne({ endpointId: data.endpointId })
    if (!endpoint) throw new Error("Unauthorized");

    const project = await db.collection("projects").findOne({ projectId: endpoint.projectId, ownerId: userId })
    if (!project) throw new Error("Unauthorized");

    await db.collection("endpoints").updateOne(
        { endpointId: data.endpointId },
        {
            $set: {
                endpointName: data.endpointName.trim(),
                url: data.url,
                method: data.method,
                intervalMinutes: data.intervalMinutes,
                expectedResponse: data.expectedResponse,
                body: data.body,
                headers: data.headers,
                enabled: data.enabled
            }
        }
    );

    // Update Cache: Fetch latest from DB or Cache to ensure we don't overwrite concurrent changes
    // Best practice: Fetch from DB (source of truth) to be sure, or fetch from Redis.
    // Since we just wrote to DB, DB is the authority.
    const freshEndpoint = await db.collection("endpoints").findOne({ endpointId: data.endpointId }, { projection: { _id: 0 } });
    if (freshEndpoint) {
        await redis.set(`endpoint:${data.endpointId}`, serialize(freshEndpoint));
    }

    await updateProjectStatus(endpoint.projectId);
    revalidatePath(`/project/${endpoint.projectId}`);
}

export async function getEndpointDetails(id: string): Promise<EndpointType> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const db = await getDB();

    // Try Cache
    const cachedEndpoint = await deserialize<EndpointType>(await redis.get(`endpoint:${id}`));
    if (cachedEndpoint) {
        const cachedProject: any = await deserialize(await redis.get(`project:${cachedEndpoint.projectId}`));
        // If project not in cache, validation might fail, but let's check basic auth
        // Use DB for auth check if cache missing
        let project = cachedProject;
        if (!project) {
            project = await db.collection("projects").findOne({ projectId: cachedEndpoint.projectId, ownerId: userId });
        } else if (project.ownerId !== userId) {
            project = null; // invalid owner
        }

        if (project) {
            return cachedEndpoint;
        }
    }


    const endpoint = await db.collection<EndpointType>("endpoints").findOne({ endpointId: id }, { projection: { _id: 0 } })
    if (!endpoint) throw new Error("Unauthorized");

    const project = await db.collection("projects").findOne({ projectId: endpoint.projectId, ownerId: userId })
    if (!project) throw new Error("Unauthorized");

    // Populate Cache
    await redis.set(`endpoint:${id}`, serialize(endpoint));

    return JSON.parse(JSON.stringify(endpoint));
}

export async function deleteEndpoint(id: string) {
    const db = await getDB();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const endpoint = await db.collection("endpoints").findOne({ endpointId: id })
    if (!endpoint) throw new Error("Unauthorized");

    const project = await db.collection("projects").findOne({ projectId: endpoint.projectId, ownerId: userId })
    if (!project) throw new Error("Unauthorized");

    await db.collection("endpoints").deleteOne({ endpointId: id })

    // Invalidate Cache
    await redis.del(`endpoint:${id}`);
    await redis.srem(`project:${endpoint.projectId}:endpoints`, id);

    await updateProjectStatus(endpoint.projectId);
    revalidatePath(`/project/${endpoint.projectId}`);
}

export async function toggleEndpoint(endpoint: EndpointType) {
    const db = await getDB();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.collection("endpoints").updateOne(
        { endpointId: endpoint.endpointId },
        {
            $set: {
                enabled: !endpoint.enabled
            }
        }
    );

    // Update Cache
    // Fetch latest to be safe
    const freshEndpoint = await db.collection("endpoints").findOne({ endpointId: endpoint.endpointId }, { projection: { _id: 0 } });
    if (freshEndpoint) {
        await redis.set(`endpoint:${endpoint.endpointId}`, serialize(freshEndpoint));
    }

    await updateProjectStatus(endpoint.projectId);
    revalidatePath(`/project/${endpoint.projectId}/e/${endpoint.endpointId}`);
}