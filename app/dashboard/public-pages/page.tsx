import getAllPublicPages from "@/app/actions/publicPageActions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Globe, LinkIcon, Layout as ProjectIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPublicPages() {
    const qnaContents = [
        {
            "title": "What is a public status page?",
            "contents": "A status page is a dedicated website where a company communicates the real-time health of its services. It is the single source of truth for users to check if a website, app, or API is functioning correctly, undergoing maintenance, or suffering an outage."
        },
        {
            "title": "Why is the status page hosted on a different domain?",
            "contents": "You will often see status pages on domains like 'status.example.com' or using a third-party provider. This is a best practice called 'infrastructure decoupling.' If the company's main website goes down due to a server failure, the status page must remain online to inform users what is happening."
        },
        {
            "title": "What is the difference between a Status Page and a Down Detector?",
            "contents": "A Status Page is the official communication channel managed by the company itself. A 'Down Detector' is a third-party tool that aggregates user complaints. Official pages are more accurate regarding technical details, while down detectors are often faster at spotting initial widespread issues before the company acknowledges them."
        }
    ]
    const publicPageData = await getAllPublicPages();

    if (!publicPageData || publicPageData.length === 0) {
        return (
            <div className="flex items-center justify-center flex-col">
                <div className="h-[100px] flex items-center">
                    <p className="text-[14px] opacity-[0.7] text-center w-full">No public status pages available</p>
                </div>
                <div className="max-w-[550px] w-full">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="item-1"
                    >
                        {qnaContents.map((item, index) => (
                            <AccordionItem value={`item-${index + 1}`} key={index}>
                                <AccordionTrigger>{item.title}</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance">
                                    <p>{item.contents}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-[30px]">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[20px]">
                {publicPageData.map((page: any, index: number) => (
                    <Link
                        key={index}
                        href={`/project/${page.projectId}/public-page`}
                        className="group flex flex-col gap-[15px] p-[20px] rounded-[15px] border bg-muted/30 hover:bg-muted/50 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-[12px]">
                            <div className="h-[45px] w-[45px] rounded-[10px] border bg-background flex items-center justify-center overflow-hidden flex-shrink-0">
                                {page.logoUrl ? (
                                    <Image src={page.logoUrl} alt={page.projectName} width={45} height={45} className="object-contain" />
                                ) : (
                                    <ProjectIcon className="opacity-[0.4]" size={20} />
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
        </div>
    )
}