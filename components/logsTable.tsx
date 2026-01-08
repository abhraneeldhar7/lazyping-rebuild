"use client"
import { EndpointType, PingLog, ProjectType } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpRight, CheckIcon, OctagonAlert, RssIcon, SquareArrowOutUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getProjectDetails } from "@/app/actions/projectActions";
import { getEndpointDetails } from "@/app/actions/endpointActions";
import { Label } from "./ui/label";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";


export default function LogsTable({ logsData }: { logsData: PingLog[] }) {
    const isMobile = useIsMobile();
    const [selectedLog, setSelectedLog] = useState<PingLog | null>(null);
    const [projectDetails, setProjectDetails] = useState<ProjectType | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        if (isSheetOpen && selectedLog) {
            const fetchData = async () => {
                try {
                    const [proj] = await Promise.all([
                        getProjectDetails(selectedLog.projectId)
                    ]);
                    setProjectDetails(proj);
                } catch (error) {
                    console.error("Failed to fetch log details:", error);
                }
            };
            fetchData();
        } else if (!isSheetOpen) {
            setProjectDetails(null);
            setSelectedLog(null);
        }
    }, [isSheetOpen, selectedLog]);


    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="opacity-[0.6] text-[12px]">
                        <TableHead className="">URL</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Latency</TableHead>
                        <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-[12px] cursor-pointer" suppressHydrationWarning>
                    {logsData.map((log, index) => (
                        <TableRow
                            key={index}
                            className={`cursor-pointer border-0 hover:border-[1px] border-border/60 h-[45px] ${index % 2 == 0 ? "dark:bg-muted/50 bg-muted " : ""}`}
                            onClick={() => {
                                setSelectedLog(log);
                                setIsSheetOpen(true);
                            }}
                        >
                            <TableCell className="text-[14px] max-w-[140px] truncate md:max-w-[unset]">
                                {log.url}
                            </TableCell>
                            <TableCell>{log.method}</TableCell>

                            <TableCell>
                                {log.status === "OK" ?
                                    <div className="rounded-full bg-[#00ff9e]/10 border border-[#00ff9e]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#00ff9e] flex items-center gap-[4px]">
                                        Active <CheckIcon size={10} />
                                    </div> :
                                    <div className="rounded-full bg-[#ed0707]/10 border border-[#ed0707]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#ed0707] flex items-center gap-[4px]">
                                        Warning <OctagonAlert size={10} />
                                    </div>
                                }
                            </TableCell>
                            <TableCell>{log.statusCode}</TableCell>
                            <TableCell>{log.latencyMs}</TableCell>
                            <TableCell suppressHydrationWarning className="opacity-[0.7] text-right">{
                                (new Date(log.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {logsData.length == 0 &&
                <p className="text-center my-[20px] opacity-[0.8] text-[15px]">No logs to show</p>
            }

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>

                <SheetContent side={isMobile ? "bottom" : "right"} className="ring-0 outline-0 focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:outline-offset-0 md:py-[16px] md:px-[20px] px-[15px] py-[10px]">
                    <SheetHeader className="absolute">
                        <SheetTitle />
                        <SheetDescription />
                    </SheetHeader>

                    <div className="flex flex-col gap-[20px] ">
                        <div className="flex flex-col gap-[3px]">
                            <Label>
                                Project name
                            </Label>
                            {!projectDetails ?
                                <div className="rounded-[4px] h-[20px] w-full animate-pulse bg-foreground/20 dark:bg-foreground/10 mt-[4px]" />
                                :
                                <Link href={`/project/${projectDetails?.projectId}`} className="flex items-center gap-[10px] text-[15px]">
                                    <p className="truncate">
                                        {projectDetails?.projectName}
                                    </p>

                                    <SquareArrowOutUpRight size={14} className="opacity-[0.7] min-w-fit" />
                                </Link>

                            }
                        </div>
                        <div className="flex flex-col gap-[3px]">
                            <Label>
                                Endpoint
                            </Label>
                            <Link href={`/project/${projectDetails?.projectId}/e/${selectedLog?.endpointId}`} className="truncate flex items-center gap-[10px] text-[15px]">
                                <p className="truncate">
                                    {selectedLog?.url}
                                </p>
                                <SquareArrowOutUpRight size={14} className="opacity-[0.7] min-w-fit" />
                            </Link>
                        </div>

                        {selectedLog?.responseMessage &&
                            <div className="flex flex-col gap-[7px]">
                                <Label>Response</Label>
                                <ScrollArea className="h-[150px] text-[15px] bg-muted py-[10px] px-[15px] border rounded-[12px]">
                                    <pre>
                                        {selectedLog?.responseMessage}
                                    </pre>
                                </ScrollArea>
                            </div>
                        }
                        {selectedLog?.errorMessage &&
                            <div className="flex flex-col gap-[7px]">
                                <Label>Error</Label>
                                <ScrollArea className="h-[150px] text-[15px] bg-muted py-[10px] px-[15px] border rounded-[12px]">
                                    <pre>
                                        {selectedLog?.errorMessage}
                                    </pre>
                                </ScrollArea>
                            </div>
                        }

                        {selectedLog?.latencyMs &&
                            <div className="flex flex-col gap-[3px]">
                                <Label>Latency <RssIcon size={12} /> </Label>
                                <p className="text-[15px]">{selectedLog?.latencyMs} ms</p>
                            </div>
                        }

                        <div className="flex flex-col gap-[6px]">
                            <Label>Status</Label>
                            <div className="flex gap-[3px] border rounded-[7px] text-[15px]">
                                <div className="w-fit bg-muted px-[10px] py-[5px] border-r rounded-[7px]">
                                    {selectedLog?.method}
                                </div>
                                <div className="flex-1 flex items-center justify-center text-[12px]">
                                    {selectedLog?.status}
                                </div>
                                <div className="flex items-center justify-center px-[15px] text-[12px]">
                                    {selectedLog?.statusCode}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <Label>Summary</Label>
                            <p className="text-[15px]">{selectedLog?.logSummary}</p>
                        </div>

                    </div>


                </SheetContent>
            </Sheet>
        </div>
    )
}