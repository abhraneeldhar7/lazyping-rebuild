import { getViewerPublicPageData } from "@/app/actions/viewerActions";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import PublicPageEndpointCard from "@/components/publicPage/endpointCard";
import { EndpointType, PingLog, ProjectType, PublicPageType } from "@/lib/types";
import { ArrowUpRight, CheckCircle, LockIcon, OctagonAlert, Server, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamicParams = true;

export default async function StatusPage({ params }: { params: Promise<{ slug: string }> }) {
    const param = await params;
    const result = await getViewerPublicPageData(param.slug);

    if (result.error) {
        if (result.error === "status page is disabled") {
            return (
                <div className="flex flex-col items-center justify-center min-h-[100vh] gap-[15px]">
                    <div className="p-[15px] bg-muted/50 rounded-full">
                        <LockIcon size={30} className="opacity-40" />
                    </div>
                    <p className="text-muted-foreground font-medium text-[16px]">Status page is disabled</p>
                </div>
            )
        }
        return (
            <div className="flex items-center justify-center min-h-[100vh]">
                <p className="text-destructive">Something went wrong. Please try again later.</p>
            </div>
        )
    }

    const { publicPageData, projectData, logs, endpoints } = result as { publicPageData: PublicPageType, projectData: ProjectType, logs: PingLog[], endpoints: EndpointType[] };

    const getStatusInfo = (status: ProjectType["overallStatus"]) => {
        switch (status) {
            case "OPERATIONAL":
                return { label: "All Systems Operational", color: "text-[#00ff9e] bg-[#00ff9e]/10 border-[#00ff9e]/30", icon: CheckCircle };
            case "DEGRADED":
                return { label: "Performance Degraded", color: "text-amber-500 bg-amber-500/10 border-amber-500/30", icon: OctagonAlert };
            case "PARTIAL_OUTAGE":
                return { label: "Partial System Outage", color: "text-orange-500 bg-orange-500/10 border-orange-500/30", icon: OctagonAlert };
            case "MAJOR_OUTAGE":
                return { label: "Major System Outage", color: "text-red-500 bg-red-500/10 border-red-500/30", icon: XCircle };
            default:
                return { label: "Unknown Status", color: "text-muted-foreground bg-muted/50 border-border", icon: Server };
        }
    };

    const statusInfo = getStatusInfo(projectData.overallStatus);
    const StatusIcon = statusInfo.icon;

    const avgLatency = endpoints.length > 0
        ? Math.round(endpoints.reduce((acc, e) => acc + (e.latency || 0), 0) / endpoints.length)
        : 0;

    return (
        <div className="relative overflow-hidden">
            {publicPageData.logoUrl &&
                <Image src={publicPageData.logoUrl} className="h-full w-full absolute z-[-1] top-0 left-0 object-cover blur-[200px] dark:opacity-[0.09] opacity-[0.12]" height={45} width={45} alt="Logo" />
            }

            <div className="min-h-[100vh] flex flex-col gap-[35px] p-[20px] pb-[100px] max-w-[800px] w-full mx-auto relative z-[1]">
                <div className="flex gap-[15px] items-center">
                    {publicPageData.logoUrl &&
                        <Image src={publicPageData.logoUrl} className="h-[45px] w-[45px] object-cover rounded-lg" height={45} width={45} alt="Logo" />
                    }
                    <div className="flex flex-col gap-[4px]">
                        <h1 className="text-[24px] font-semibold leading-[1.1em]">{publicPageData.projectName}</h1>
                        {publicPageData.siteUrl &&
                            <Link className="text-[14px] flex items-center gap-[6px] leading-[1em] underline opacity-[0.6] hover:opacity-100 transition-opacity" href={publicPageData.siteUrl} target="_blank">{publicPageData.siteUrl} <ArrowUpRight size={13} /></Link>
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-[25px]">
                    <div className="flex flex-col gap-[7px]">
                        <h3 className="text-[14px] opacity-[0.7]">Current Status</h3>
                        <div className={`flex items-center gap-[10px] px-[14px] py-[10px] rounded-[20px] border w-fit ${statusInfo.color}`}>
                            <StatusIcon size={16} />
                            <p className="text-[16px] leading-none">{statusInfo.label}</p>
                        </div>
                    </div>

                    <div className="flex flex-col leading-[1em] gap-[10px]">
                        <h3 className="text-[14px] opacity-[0.7]">Overall Latency</h3>
                        <p className="text-[24px] font-bold">{avgLatency}ms</p>
                    </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                    <h3 className="text-[14px] opacity-[0.7]">Services</h3>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-[12px]">
                        {endpoints.map((endpoint, index) => (
                            <PublicPageEndpointCard
                                endpoint={endpoint}
                                logs={logs.filter(log => log.endpointId === endpoint.endpointId)}
                                key={index}
                            />
                        ))}
                    </div>
                </div>




                <div className="mt-[20px]">
                    <ChartAreaInteractive logs={logs} hideShadows={true} />
                </div>
            </div>
        </div>
    )
}