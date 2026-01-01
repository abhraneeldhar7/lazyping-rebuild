"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeOnboarding() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    await (await clerkClient()).users.updateUser(userId, {
        publicMetadata: {
            onboardingCompleted: true
        },
    });
}
