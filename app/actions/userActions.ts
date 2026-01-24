"use server"

import { getDB } from "@/lib/db";
import { UserType } from "@/lib/types";

export async function getUserDetails(userId: string) {
    const db = await getDB();
    const userDetails = await db.collection<UserType>("users").findOne({ userId: userId });
    return userDetails;
}