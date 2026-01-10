"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardTabs() {
    const pathname = usePathname()

    const dashboardTabs = [
        { label: "Overview", href: "/dashboard" },
        { label: "Public Pages", href: "/dashboard/public-pages" },
        { label: "Logs", href: "/dashboard/logs" },
        // { label: "Integrations", href: "/integrations" },
        // { label: "Settings", href: "/dashboard/settings" },
    ]

    return (
        <div className="fixed flex px-[15px] items-center top-[50px] h-[40px] backdrop-blur-[20px] bg-background/50 w-full z-[10] gap-[5px]">
            {dashboardTabs.map((tab, index) => {
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
