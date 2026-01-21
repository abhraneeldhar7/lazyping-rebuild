"use client"
import { EndpointType, PingLog, ProjectType } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpRight, CheckIcon, OctagonAlert, ProjectorIcon, RssIcon, SquareArrowOutUpRight } from "lucide-react";
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

    // Check if all logs are from the same project
    const uniqueProjectIds = [...new Set(logsData.map(log => log.projectId))];
    const isSingleProject = uniqueProjectIds.length === 1;

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
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="opacity-[0.6] text-[12px]">
                        <TableHead className="min-w-[250px]">URL</TableHead>
                        <TableHead className="w-[100px]">Method</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="w-[90px]">Code</TableHead>
                        <TableHead className="w-[120px]">Latency</TableHead>
                        <TableHead className="w-[120px] text-right">Time</TableHead>
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
                            <TableCell className="min-w-[250px]">
                                <div className="truncate text-[14px] max-w-[200px] md:max-w-none">
                                    {(() => {
                                        if (!isSingleProject) {
                                            return log.url;
                                        }
                                        try {
                                            const url = new URL(log.url);
                                            const display = url.pathname + url.search;
                                            // Always show pathname if it's not just "/"
                                            if (display !== "/") {
                                                return display;
                                            }
                                            // For root path, show full URL
                                            return log.url;
                                        } catch (e) {
                                            return log.url;
                                        }
                                    })()}
                                </div>
                            </TableCell>
                            <TableCell className="w-[100px]">{log.method}</TableCell>

                            <TableCell className="w-[150px]">
                                {log.status === "OK" ?
                                    <div className="rounded-full bg-[#00ff9e]/10 border border-[#00ff9e]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#00ff9e] flex items-center gap-[4px]">
                                        Active <CheckIcon size={10} />
                                    </div> :
                                    log.status === "RESOLVED" ?
                                        <div className="rounded-full bg-muted border border-border py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-muted-foreground flex items-center gap-[4px]">
                                            Resolved <CheckIcon size={10} />
                                        </div> :
                                        <div className="rounded-full bg-[#ed0707]/10 border border-[#ed0707]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#ed0707] flex items-center gap-[4px]">
                                            Warning <OctagonAlert size={10} />
                                        </div>
                                }
                            </TableCell>
                            <TableCell className="w-[90px]">{log.statusCode}</TableCell>
                            <TableCell className="w-[120px]">{log.latencyMs} ms</TableCell>
                            <TableCell suppressHydrationWarning className="w-[120px] opacity-[0.7] text-right">{
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

                <SheetContent side={isMobile ? "bottom" : "right"} className="ring-0 outline-0 focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:outline-offset-0 md:py-[16px] md:px-[20px] px-[20px] py-[40px]">
                    <SheetHeader className="absolute">
                        <SheetTitle />
                        <SheetDescription />
                    </SheetHeader>

                    <div className="flex flex-col gap-[20px] ">
                        <div className="flex flex-col gap-[5px]">
                            <Label>
                                Project name
                            </Label>
                            <div className="flex rounded-[8px] leading-[1em] border h-[35px] w-full text-[14px]">
                                <div className="w-fit flex items-center justify-center px-[10px] bg-muted rounded-tl-[8px] rounded-bl-[8px]"><ProjectorIcon size={14} /></div>
                                <Link href={`/project/${projectDetails?.projectId}`} className="truncate flex justify-between w-full gap-[10px] h-full flex-1 flex items-center px-[10px]">
                                    <p className="truncate">
                                        {projectDetails?.projectName}
                                    </p>
                                    <SquareArrowOutUpRight size={14} className="min-w-fit text-primary" />
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[5px]">
                            <Label>
                                Endpoint
                            </Label>
                            <div className="flex rounded-[8px] leading-[1em] border h-[35px] w-full text-[14px]">
                                <div className="w-fit flex items-center justify-center px-[10px] bg-muted rounded-tl-[8px] rounded-bl-[8px]">{selectedLog?.method}</div>
                                <Link href={`/project/${projectDetails?.projectId}/e/${selectedLog?.endpointId}`} className="truncate flex justify-between w-full gap-[10px] h-full flex-1 flex items-center px-[10px]">
                                    <p className="truncate">
                                        {selectedLog?.url}
                                    </p>
                                    <SquareArrowOutUpRight size={14} className="min-w-fit text-primary" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-between gap-[10px] items-end">
                            {selectedLog?.latencyMs &&
                                <div className="flex flex-col gap-[3px]">
                                    <Label>Latency <RssIcon size={12} /> </Label>
                                    <p className="text-[15px]">{selectedLog?.latencyMs} ms</p>
                                </div>
                            }
                            {selectedLog &&
                                <>
                                    {selectedLog.status === "OK" ?
                                        <div className="rounded-full bg-[#00ff9e]/10 border border-[#00ff9e]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#00ff9e] flex items-center gap-[4px]">
                                            Active <CheckIcon size={10} />
                                        </div> :
                                        selectedLog.status === "RESOLVED" ?
                                            <div className="rounded-full bg-muted border border-border py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-muted-foreground flex items-center gap-[4px]">
                                                Resolved <CheckIcon size={10} />
                                            </div> :
                                            <div className="rounded-full bg-[#ed0707]/10 border border-[#ed0707]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[11px] text-[#ed0707] flex items-center gap-[4px]">
                                                Warning <OctagonAlert size={10} />
                                            </div>
                                    }
                                </>
                            }
                        </div>

                        {selectedLog?.responseMessage &&
                            <div className="flex flex-col gap-[7px]">
                                <Label>Response</Label>
                                <ScrollArea className="h-[150px] text-[14px] bg-muted py-[8px] px-[10px] border rounded-[12px]">
                                    <p className="font-[300]">
                                        {selectedLog.responseMessage}
                                    </p>
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



                        <p className="text-[12px] opacity-[0.6] text-center mt-[15px]">{selectedLog?.logSummary}</p>
                    </div>


                </SheetContent>
            </Sheet >
        </div >
    )
}