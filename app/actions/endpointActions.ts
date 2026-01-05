"use server"

import { getDB } from "@/lib/db";
import { EndpointType, methodType, PingLog } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

/**
 * Adds a monitored endpoint to a project
 */
export async function createEndpoint(data: {
    url: string;
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
    revalidatePath(`/project/${data.projectId}`);
    return (newEndpoint.endpointId)
}


export async function getEndpoints(projectId: string) {
    const db = await getDB();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const project = await db.collection("projects").findOne({ projectId: projectId, ownerId: userId })
    if (!project) throw new Error("Unauthorized");

    const endpoints = await db.collection<EndpointType>("endpoints").find({ projectId: projectId }, { projection: { _id: 0 } }).toArray();

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
    revalidatePath(`/project/${endpoint.projectId}`);
}

export async function getEndpointDetails(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const db = await getDB();

    const endpoint = await db.collection<EndpointType>("endpoints").findOne({ endpointId: id })
    if (!endpoint) throw new Error("Unauthorized");

    const project = await db.collection("projects").findOne({ projectId: endpoint.projectId, ownerId: userId })
    if (!project) throw new Error("Unauthorized");

    return endpoint;
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
    revalidatePath(`/project/${endpoint.projectId}`);
}