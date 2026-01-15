import { ArrowUpRight, Globe, LinkIcon, ProjectorIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllUserPublicPages } from "@/app/actions/publicPageActions";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import LoadingPublicPagesSkeleton from "@/app/dashboard/public-pages/loading";

export default async function PublicLagesAll() {
    const publicPageData = await getAllUserPublicPages();
    return (
        <div className="w-full">
            <Suspense fallback={<LoadingPublicPagesSkeleton />}>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[15px]">
                    {publicPageData.map((page: any, index: number) => (
                        <Link
                            key={index}
                            href={`/project/${page.projectId}/public-page`}
                            className="group flex flex-col gap-[15px] p-[20px] rounded-[15px] border bg-muted/30 hover:bg-muted/50 transition-all duration-300 relative overflow-hidden h-[145px]"
                        >
                            <div className="flex items-center gap-[12px]">
                                <div className="h-[45px] w-[45px] rounded-[10px] border bg-background flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {page.logoUrl ? (
                                        <Image src={page.logoUrl} alt={page.projectName} width={45} height={45} className="object-contain" />
                                    ) : (
                                        <ProjectorIcon className="opacity-[0.4]" size={20} />
                                    )
                                    }
                                </div>
                                <div className="flex flex-col gap-[2px] overflow-hidden">
                                    <h3 className="text-[16px] font-medium truncate">{page.projectName}</h3>
                                    <div className="flex items-center gap-[6px]">
                                        <div className={cn("h-[8px] w-[8px] rounded-full", page.enabled ? "bg-[#00ff9e]" : "bg-muted-foreground")} />
                                        <span className="text-[12px] opacity-[0.6]">{page.enabled ? "Active" : "Disabled"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[8px] mt-auto">
                                <div className="flex items-center gap-[8px] text-[13px] opacity-[0.7]">
                                    <Globe size={14} className="flex-shrink-0" />
                                    <span className="truncate">{page.siteUrl || "No URL set"}</span>
                                </div>
                                <div className="flex items-center gap-[8px] text-[13px] opacity-[0.7]">
                                    <LinkIcon size={14} className="flex-shrink-0" />
                                    <span className="truncate font-mono">/{page.pageSlug}</span>
                                </div>
                            </div>

                            <div className="absolute top-[15px] right-[15px] opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight size={18} />
                            </div>
                        </Link>
                    ))}
                </div>
            </Suspense>
        </div>
    )
}