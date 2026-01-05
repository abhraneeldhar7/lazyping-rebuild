"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AutoRefresh() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 60000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [router]);

    return null;
}
