"use client"

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation"
import { EndpointType } from "@/lib/types";
import Link from "next/link";

function capitalize(str: string) {
    return (str[0].toUpperCase() + str.slice(1, str.length).toLowerCase())
}

export default function ProjectTitle({ projectName, endpoints }: { projectName: string, endpoints: EndpointType[] }) {
    const pathname = usePathname();
    const pathParts = pathname.split("/");
    const projectId = pathParts[2];
    const isEndpointPage = pathname.includes(`/project/${projectId}/e/`);
    const endpointId = isEndpointPage ? pathParts[4] : null;

    const endpoint = endpointId ? endpoints.find(e => e.endpointId === endpointId) : null;
    let endpointDisplay = "Endpoint";
    if (endpoint) {
        try {
            const url = new URL(endpoint.url);
            endpointDisplay = url.pathname + url.search;
            if (endpointDisplay === "/") endpointDisplay = url.hostname;
        } catch (e) {
            endpointDisplay = endpoint.url;
        }
    }

    return (
        <div className="flex gap-[10px] items-center">
            <div className="flex gap-[10px] items-center leading-[1em]">
                <Link href={`/project/${projectId}`} className={`select-none cursor-pointer text-[15px] ${isEndpointPage ? "opacity-[0.7]" : ""}`} >{projectName}</Link>
            </div>
            {isEndpointPage && (
                <>
                    <ChevronRight size={14} className="opacity-[0.3]" />
                    <div className="flex gap-[10px] items-center leading-[1em]">
                        <Link href={`/project/${projectId}/e/${endpointId}`} className={`select-none cursor-pointer text-[15px] font-medium`} >{endpointDisplay || "Endpoint"}</Link>
                    </div>
                </>
            )}
        </div>
    )
}