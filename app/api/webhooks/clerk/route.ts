import { Webhook } from "svix";
import { headers } from "next/headers";
import { getDB } from "@/lib/db";

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
    const users = db.collection("users");

    const data = evt.data;

    await users.updateOne(
      { clerkId: data.id },
      {
        $set: {
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          avatar: data.image_url,
          provider: data.external_accounts?.[0]?.provider || "email",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  return new Response("OK");
}
