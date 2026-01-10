"use server"
import { getDB } from "@/lib/db"
import { PublicPageType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { getAllUserProjectLogs, getProjectDetails, getProjects } from "./projectActions";
import { revalidatePath } from "next/cache";

const RESERVED_SLUGS = [
    "dashboard",
    "login",
    "signup",
    "project",
    "api",
    "blog",
    "blogs",
    "welcome",
    "integrations",
    "profile",
    "privacy-policy",
    "contact-us",
    "settings",
    "admin",
    "status",
    "public",
    "auth",
    "legal",
    "terms",
    "faq",
    "docs",
    "help",
    "pricing"
];

export async function getPublicPageFromID(projectId: string) {
    const { userId } = await auth();
    if (!userId) return null;
    const db = await getDB();
    const publicPage = await db.collection("public-page").findOne({ projectId });
    return (JSON.parse(JSON.stringify(publicPage)))
}

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces/hyphens)
        .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
        .replace(/^-+|-+$/g, ""); // Trim hyphens
}

async function isSlugAvailable(slug: string, currentProjectId?: string) {
    const normalizedSlug = slug.toLowerCase();
    if (RESERVED_SLUGS.includes(normalizedSlug) || normalizedSlug.length < 3) {
        return false;
    }

    const db = await getDB();
    const existing = await db.collection("public-page").findOne({ pageSlug: normalizedSlug });
    if (existing && existing.projectId !== currentProjectId) {
        return false;
    }
    return !existing || existing.projectId === currentProjectId;
}

export async function generateUniqueSlug(projectName: string) {
    const baseSlug = generateSlug(projectName);
    let slug = baseSlug;

    // Ensure slug is at least 3 chars
    if (slug.length < 3) {
        slug = (slug + "pg").padEnd(3, "0");
    }

    let isAvailable = await isSlugAvailable(slug);

    if (!isAvailable) {
        let counter = 1;
        while (!isAvailable) {
            const candidate = `${slug}-${counter}`;
            isAvailable = await isSlugAvailable(candidate);
            if (isAvailable) {
                slug = candidate;
                break;
            }
            counter++;
        }
    }
    return slug;
}

export async function createProjectPublicPage(projectId: string) {
    const { userId } = await auth();
    if (!userId) return null;

    const db = await getDB();
    const projectData = await getProjectDetails(projectId);

    if (!projectData || projectData.ownerId !== userId) {
        throw new Error("Unauthorized");
    }

    // Check if page already exists
    const existingPage = await db.collection("public-page").findOne({ projectId });
    if (existingPage) return JSON.parse(JSON.stringify(existingPage));

    const slug = await generateUniqueSlug(projectData.projectName);

    const newPublicPage: PublicPageType = {
        projectId: projectData.projectId,
        projectName: projectData.projectName,
        siteUrl: "",
        pageSlug: slug,
        enabled: true,
        logoUrl: null,
    };

    const result = await db.collection("public-page").insertOne(newPublicPage);
    revalidatePath(`/project/${projectId}/public-page`);
    return JSON.parse(JSON.stringify(newPublicPage));
}

export async function savePublicPage(pageData: PublicPageType) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();
    const projectData = await getProjectDetails(pageData.projectId);

    if (!projectData || projectData.ownerId !== userId) {
        throw new Error("Unauthorized access to project");
    }

    // Validate slug
    const normalizedSlug = generateSlug(pageData.pageSlug);
    if (!normalizedSlug || normalizedSlug.length < 3) {
        throw new Error("Slug must be at least 3 characters long");
    }

    if (RESERVED_SLUGS.includes(normalizedSlug)) {
        throw new Error("This slug is reserved and cannot be used");
    }

    const existingPageWithSlug = await db.collection("public-page").findOne({
        pageSlug: normalizedSlug,
        projectId: { $ne: pageData.projectId }
    });

    if (existingPageWithSlug) {
        throw new Error("Slug is already in use by another project");
    }

    const updateData = {
        projectName: pageData.projectName,
        siteUrl: pageData.siteUrl,
        pageSlug: normalizedSlug,
        logoUrl: pageData.logoUrl,
        lastUpdated: new Date()
    };

    await db.collection("public-page").updateOne(
        { projectId: pageData.projectId },
        { $set: updateData }
    );

    revalidatePath(`/project/${pageData.projectId}/public-page`);
    revalidatePath(`/${normalizedSlug}`);
    return { success: true, newSlug: normalizedSlug };
}

export async function togglePublicPageStatus(projectId: string, enabled: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();
    const publicPage = await db.collection("public-page").findOne({ projectId });

    if (!publicPage) throw new Error("Public page not found");

    const projectData = await getProjectDetails(projectId);
    if (!projectData || projectData.ownerId !== userId) {
        throw new Error("Unauthorized access to project");
    }

    await db.collection("public-page").updateOne(
        { projectId },
        { $set: { enabled, lastUpdated: new Date() } }
    );

    revalidatePath(`/project/${projectId}/public-page`);
    revalidatePath(`/${publicPage.pageSlug}`);
    return { success: true };
}

export default async function getAllPublicPages() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();
    const projects = await getProjects();
    const publicPages = await db.collection("public-page").find({ projectId: { $in: projects.map((p) => p.projectId) } }).toArray();
    return JSON.parse(JSON.stringify(publicPages));
}