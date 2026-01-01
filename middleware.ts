// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/project(.*)",
    "/profile(.*)",
]);

const isAuthRoute = createRouteMatcher([
    "/login(.*)",
    "/signup(.*)",
]);

const isOnboardingRoute = createRouteMatcher([
    "/welcome(.*)",
]);

type PublicMetadata = {
    onboardingCompleted?: boolean;
};

function isOnboarded(metadata: unknown): boolean {
    if (typeof metadata !== "object" || metadata === null) return false;
    return (metadata as PublicMetadata).onboardingCompleted === true;
}

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();
    const onboardingCompleted = (sessionClaims as any)?.metadata?.onboardingCompleted === true;

    // 🔒 Protect private routes
    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    // 🚧 Logged-in but not onboarded → force onboarding
    if (userId && isProtectedRoute(req) && !onboardingCompleted) {
        return NextResponse.redirect(new URL("/welcome", req.url));
    }

    // ✅ Onboarded users should not access onboarding again
    if (userId && isOnboardingRoute(req) && onboardingCompleted) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (!userId && isOnboardingRoute(req)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🔁 Signed-in users should not see auth pages
    if (userId && isAuthRoute(req)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
});

export const config = {
    matcher: ["/((?!_next|.*\\..*).*)"],
};
