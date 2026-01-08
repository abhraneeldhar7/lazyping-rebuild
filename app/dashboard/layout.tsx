import DashboardTabs from "@/components/dashboardTabs";
import DashboardTitle from "@/components/dashboardTitle";
import { UserPopoverComponent } from "@/components/userPopover";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="relative overflow-hidden">
            <div className="rounded-[50%] w-[120%] h-[20vh] left-[50%] translate-x-[-50%] absolute top-[-15vh] bg-primary dark:bg-primary/80 z-[-1] opacity-[0.4] blur-[80px] animate-pulse" />

            <div className="fixed top-0 bg-background z-[10] w-full border-b-[1px] border-foreground/20 h-[50px] flex items-center p-[5px] px-[10px] gap-[12px]">
                <Link href="/dashboard">
                    <Image src="/appLogo.png" alt="" height={25} width={25} unoptimized />
                </Link>
                <ChevronRight size={15} className="opacity-[0.3]" />
                <DashboardTitle />
                <div className="ml-auto">
                    <UserPopoverComponent />
                </div>
            </div>

            <DashboardTabs />

            <div className="p-[15px] max-w-[1200px] w-full mx-auto min-h-[100vh] pt-[120px]">
                {children}
            </div>
        </div>
    );
}