# Step-by-Step Onboarding Implementation Guide

This document explains exactly how we will implement the onboarding flow for LazyPing.

## 1. The Strategy
We want to ensure that every new user provides basic information (like their role and how they found us) before they can access the dashboard. 

### Core Components:
1.  **Memory (Clerk Metadata)**: To store if a user has finished onboarding.
2.  **Gatekeeper (Middleware)**: To redirect users who haven't finished onboarding.
3.  **Interface (Onboarding Page)**: The visual form where users answer questions.

---

## 2. Step-by-Step Process

### Step 1: Defining the "Gatekeeping" logic
We use Next.js **Middleware** to intercept every request. 
Inside `middleware.ts`, we check:
- Is the user logged in?
- If yes, does their `publicMetadata` have `onboardingComplete: true`?
- If not, redirect them to `/onboarding`.

### Step 2: Creating the Onboarding UI
We create a new folder `app/onboarding/` and a `page.tsx`.
- We'll use a **Multi-step state** (e.g., `const [step, setStep] = useState(1)`).
- **Step 1**: "What is your role?" -> Shows buttons for Developer, Founder, etc.
- **Step 2**: "How did you hear about us?" -> Shows a list of options.
- We add smooth CSS animations so it feels "premium".

### Step 3: Saving Progress
When the user clicks "Finish":
1.  We trigger a **Server Action**.
2.  The action uses the Clerk Backend SDK to update the user:
    ```typescript
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { onboardingComplete: true }
    });
    ```
3.  We then redirect the user to `/dashboard`.

---

## 3. Implementation Plan for LazyPing

### [Middleware]
#### [MODIFY] [middleware.ts](file:///d:/Workspace/Visual%20Studio%20Workspace/lazyping/middleware.ts)
- Add a check for `onboardingComplete` in the user's session claims.
- If missing, redirect to `/onboarding`.

### [Onboarding Page]
#### [NEW] [app/onboarding/page.tsx](file:///d:/Workspace/Visual%20Studio%20Workspace/lazyping/app/onboarding/page.tsx)
- Build a beautiful, centered card using Tailwind CSS.
- Implement the "Role" and "Source" questions.
- For now (as requested), we won't store the answers in a database, just update the Clerk metadata.

### [Server Action]
#### [NEW] [app/onboarding/_actions.ts](file:///d:/Workspace/Visual%20Studio%20Workspace/lazyping/app/onboarding/_actions.ts)
- Create a server action to handle the Clerk metadata update.

---

## 4. How to Learn from This
Keep an eye on the `middleware.ts` and `app/onboarding/page.tsx` files as I create/modify them. I will add comments explaining the logic in each file.
