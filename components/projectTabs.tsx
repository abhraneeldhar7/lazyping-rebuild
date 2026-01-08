"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ProjectTabs({ projectId }: { projectId: string }) {
    const pathname = usePathname()

    // Check if we are in an endpoint route: /project/[id]/e/[endpointId]/...
    const pathParts = pathname.split("/")
    const isEndpointPage = pathParts.length >= 5 && pathParts[3] === "e"
    const endpointId = isEndpointPage ? pathParts[4] : null

    const projectTabs = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Overview", href: `/project/${projectId}` },
        { label: "Logs", href: `/project/${projectId}/logs` },
        { label: "Settings", href: `/project/${projectId}/settings` },
    ]

    const endpointTabs = [
        { label: "Project", href: `/project/${projectId}` },
        { label: "Overview", href: `/project/${projectId}/e/${endpointId}` },
        { label: "Logs", href: `/project/${projectId}/e/${endpointId}/logs` },
        { label: "Settings", href: `/project/${projectId}/e/${endpointId}/settings` },
    ]

    const tabs = isEndpointPage ? endpointTabs : projectTabs

    return (
        <div className="fixed flex px-[15px] items-center top-[50px] h-[40px] backdrop-blur-[20px] bg-background/50 w-full z-[10] gap-[5px]">
            {tabs.map((tab, index) => {
                const isActive = pathname === tab.href
                return (
                    <Link key={index} href={tab.href}>
                        <Button
                            variant="ghost"
                            className={`font-[400] rounded-[4px] h-[30px] text-[12px] relative`}
                        >
                            {tab.label}
                            <div className={`h-[2px] left-[50%] translate-x-[-50%] rounded-[10px] bg-primary absolute bottom-0 left-0 ${isActive ? "w-[90%]" : "w-0"} transition-all duration-200`} />
                        </Button>
                    </Link>
                )
            })}
        </div>
    )
}
