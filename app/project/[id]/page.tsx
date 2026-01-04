"use client"
import AddEndpointBtn from "@/components/addEndpoint";
import BarUptime from "@/components/barUptime";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import { useProject } from "@/components/projectContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, Github, OctagonAlert, PauseIcon, RssIcon, StickerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { validate } from "uuid";
import { cn } from "@/lib/utils";

export default function ProjectPage() {
    const { projectData, endpoints, logs } = useProject();
    const router = useRouter();

    const briefStats = [
        { label: "Status", value: "Active" },
        { label: "Enabled", value: "True" },
        { label: "Ping interval", value: "5 m" },
        { label: "Average Latency", value: "50 ms" },
    ]

    const FancyStatCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        return (
            <div className={cn("flex flex-col gap-[8px] flex-1 bg-muted/40 border border-border/40 hover:border-primary/20 transition-all duration-200 hover:shadow-sm rounded-[10px] px-[15px] py-[10px] md:h-[180px] overflow-hidden relative group", className)}>
                {children}
                <div className="h-[30px] transition-all duration-300 group-hover:blur-[32px] group-hover:h-[30px] group-hover:w-[140%] rounded-[50%] blur-[40px] w-[110%] left-[50%] translate-x-[-50%] bottom-0 absolute translate-y-[50%] bg-primary z-[-1] opacity-[0.4]" />
            </div>
        )
    }
    return (
        <>
            {/* <div className="rounded-[10px] border-[2px] bg-[#f72424]/20 dark:bg-[#f72424]/12 border-[#f72424]/10 p-[15px] relative my-[20px]">
                <X className="absolute right-[10px] top-[10px] hover:bg-background/40 cursor-pointer rounded-[50%] p-[3px]" size={22} />
                <h1 className="text-[18px]">Warning</h1>
                <p className="text-[15px] opacity-[0.9] mt-[5px]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae error, illo ipsa tempora in delectus soluta minima! Recusandae, dolores rerum?</p>
            </div> */}


            <div className="flex mb-[30px] md:flex-row flex-col gap-[30px]">
                <div className="flex-1">
                    <p className="opacity-[0.7] text-[14px]">Project name</p>
                    <h1 className="text-[25px] truncate">{projectData?.projectName}</h1>
                    {/* <Button className="mt-[15px]" variant="outline"><Github /> Repository</Button> */}
                </div>

                <div className="flex-1 flex flex-col items-center md:items-end gap-[10px] mt-[15px]">
                    <BarUptime logs={logs} />
                </div>
            </div>

            <div className="flex my-[40px] md:flex-row flex-col gap-[25px] justify-between">

                <FancyStatCard>
                    <h1 className="mb-auto text-[16px]">Project Stats</h1>
                    {briefStats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-[10px]">
                            <h1 className="text-[14px] opacity-[0.7]">{stat.label}</h1>
                            <p className="text-[15px]">{stat.value}</p>
                        </div>
                    ))}
                </FancyStatCard>

                <FancyStatCard className="p-[10px]">
                    <div className="mb-auto px-[5px]">
                        <h1 className="text-[16px]">Project Stats</h1>
                        <p className="opacity-[0.7] text-[14px]">Pings all endpoints of your project</p>
                    </div>
                    <Button variant="outline" className="w-full ml-auto h-[40px]"><RssIcon /> Ping</Button>
                </FancyStatCard>

                <FancyStatCard>
                    <div className="mb-auto">
                        <h1 className="text-[16px]">Export data</h1>
                        <p className="opacity-[0.7] text-[14px]">Export endpoints and logs of your project</p>
                    </div>
                </FancyStatCard>


            </div>

            {logs.length > 1 &&
                <div className="my-[30px]">
                    <ChartAreaInteractive />
                </div>
            }


            <div className="flex flex-col gap-[25px] items-center">
                {endpoints.length > 0 &&
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Endpoint</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]">Interval</TableHead>
                                <TableHead className=""></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {endpoints.map((endpoint, index) => (
                                <TableRow className="cursor-pointer select-none h-[45px]" key={index} onClick={() => {
                                    router.push(`/ project / ${projectData.projectId} /e/${endpoint.endpointId} `)
                                }}>
                                    <TableCell className="">
                                        <div className="max-w-[250px] relative h-[1.5em]">
                                            <p className="absolute top-0 left-0 right-0 truncate">
                                                {endpoint.url}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {endpoint.currentStatus == "UP" ?
                                            <p className="rounded-[20px] bg-[#00ff9e]/30 border-[1px] py-[4px] leading-[1em] w-fit px-[7px] text-[12px] flex gap-[6px]">
                                                Active
                                                <CheckIcon size={12} />
                                            </p> :
                                            <p className="rounded-[20px] bg-[#ed0707]/30 border-[1px] py-[4px] leading-[1em] w-fit px-[7px] text-[12px] flex gap-[6px]">
                                                Warning
                                                <OctagonAlert size={12} />
                                            </p>
                                        }
                                    </TableCell>
                                    <TableCell>5min</TableCell>
                                    <TableCell className="text-right"></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}

                {endpoints.length < 1 &&
                    <div className="flex flex-col items-center gap-[15px] bg-muted/40 px-[15px] py-[50px] w-full rounded-[8px] border cursor-pointer">
                        <StickerIcon size={30} />
                        <div className="text-center flex flex-col gap-[10px]">
                            <p>No endpoints added for this project</p>
                            <p className="opacity-[0.7] font-[300] text-[14px]">Add endpoints to your project to keep them warm</p>
                        </div>
                    </div>
                }

                <AddEndpointBtn projectId={projectData.projectId} />
            </div>
        </>
    )
}