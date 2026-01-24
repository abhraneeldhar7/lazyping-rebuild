import { Webhook } from "svix";
import { headers } from "next/headers";
import { getDB } from "@/lib/db";
import redis from "@/lib/redis";
import { UserType } from "@/lib/types";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  const evt = wh.verify(payload, {
    "svix-id": headersList.get("svix-id")!,
    "svix-timestamp": headersList.get("svix-timestamp")!,
    "svix-signature": headersList.get("svix-signature")!,
  }) as any;

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const db = await getDB();
    const users = db.collection<UserType>("users");

    const data = evt.data;

    await users.updateOne(
      { userId: data.id },
      {
        $set: {
          userId: data.id,
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          avatar: data.image_url,
          provider: data.external_accounts?.[0]?.provider || "email",
          createdAt: new Date(),
          updatedAt: new Date(),
          subscriptionTier: "FREE"
        }
      }
    );


    (await clerkClient()).users.updateUser(data.id, {
      publicMetadata: {
        onboardingCompleted: false,
        subscriptionTier: "FREE"
      }
    })
  }




  else if (evt.type === "user.deleted") {
    const db = await getDB();
    const userId = evt.data.id;

    // 1. Find all projects belonging to this user
    const projects = await db.collection("projects").find({ ownerId: userId }).toArray();
    const projectIds = projects.map(p => p.projectId);

    if (projectIds.length > 0) {
      // 2. Delete all related data from MongoDB
      await db.collection("endpoints").deleteMany({ projectId: { $in: projectIds } });
      await db.collection("logs").deleteMany({ projectId: { $in: projectIds } });
      await db.collection("public-page").deleteMany({ projectId: { $in: projectIds } });
      await db.collection("projects").deleteMany({ ownerId: userId });

      // 3. Clean up Redis Cache
      const pipeline = redis.pipeline();

      for (const projectId of projectIds) {
        pipeline.del(`project:${projectId}`);

        // Cleanup endpoints for each project
        const endpointIds = await redis.smembers(`project:${projectId}:endpoints`);
        if (endpointIds.length > 0) {
          endpointIds.forEach(eid => pipeline.del(`endpoint:${eid}`));
        }
        pipeline.del(`project:${projectId}:endpoints`);
      }

      pipeline.del(`user:${userId}:projects`);
      await pipeline.exec();
    }

    // 4. Delete the user from MongoDB
    await db.collection("users").deleteOne({ userId });
  }

  return new Response("OK");
}
