import { PingLog } from "@/lib/types"
import LogsTable from "../logsTable"
import { TableCell, TableRow } from "../ui/table";
import { CheckIcon, OctagonAlert } from "lucide-react";
import { Marquee } from "../ui/marquee";

export default function LogsThing() {
    const logsData: PingLog[] = [
        {
            projectId: "proj_1",
            endpointId: "end_1",
            url: "/v1/health",
            method: "GET",
            status: "OK",
            responseMessage: "Healthy",
            statusCode: 200,
            latencyMs: 124,
            timestamp: new Date(),
            logSummary: "Ping successful"
        },
        {
            projectId: "proj_1",
            endpointId: "end_2",
            url: "/v1/users",
            method: "GET",
            status: "OK",
            responseMessage: "OK",
            statusCode: 200,
            latencyMs: 89,
            timestamp: new Date(),
            logSummary: "Ping successful"
        },
        {
            projectId: "proj_2",
            endpointId: "end_3",
            url: "/login",
            method: "POST",
            status: "HTTP_5XX",
            responseMessage: "Internal Server Error",
            errorMessage: "Server failed to respond within expected time",
            statusCode: 500,
            latencyMs: 5000,
            timestamp: new Date(),
            logSummary: "Endpoint returned 500 error"
        },
        {
            projectId: "proj_1",
            endpointId: "end_4",
            url: "/v1/posts",
            method: "GET",
            status: "OK",
            responseMessage: "OK",
            statusCode: 200,
            latencyMs: 156,
            timestamp: new Date(),
            logSummary: "Ping successful"
        }
    ]

    return (
        <div className="flex flex-col gap-[20px] relative">
            <p className="text-[19px] px-[25px]">
                <span className="font-[600]">
                    Detailed logs
                </span>{" "}
                <span className="opacity-[0.8]">
                    tells you exactly what went wrong
                </span>
            </p>
            <div
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-none select-none w-full relative"
            // style={{
            //     transform: 'rotateX(60deg) rotateZ(-20deg) rotateY(-5deg)',
            //     transformStyle: 'preserve-3d'
            // }}
            >

                <div className="h-full w-[50px] absolute left-0 bg-gradient-to-r from-background from-[20%] to-transparent z-[2]" />
                <div className="h-full w-[50px] absolute right-0 bg-gradient-to-l from-background from-[20%] to-transparent z-[2]" />
                <div className="h-[50px] w-full absolute bottom-0 bg-gradient-to-t from-background from-[20%] to-transparent z-[2]" />
                <div className="h-[50px] w-full absolute top-0 bg-gradient-to-b from-background from-[20%] to-transparent z-[2]" />

                <Marquee className="[--duration:20s] gap-[0px] h-[200px] w-full" vertical>
                    <div>

                        {logsData.map((log, index) => (
                            <TableRow
                                key={index}
                                className={`cursor-pointer text-[12px] border-0 hover:border-[1px] h-[40px] ${index % 2 == 0 ? "dark:bg-muted/50 bg-muted " : ""}`}                        >
                                {/* <TableCell className="min-w-[180px]">
                                <div className="truncate text-[14px] max-w-[250px] md:max-w-none">
                                    {log.url}
                                </div>
                            </TableCell> */}
                                <TableCell className="pl-[20px] text-center w-[80px] sm:table-cell">{log.method}</TableCell>
                                <TableCell className="text-[11px] w-[120px]">
                                    {log.status === "OK" ?
                                        <div className="rounded-full bg-[#00ff9e]/10 border border-[#00ff9e]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[#00ff9e] flex items-center gap-[4px]">
                                            Active <CheckIcon size={10} />
                                        </div> :
                                        <div className="rounded-full bg-[#ed0707]/10 border border-[#ed0707]/30 py-[2px] pt-[3px] px-[8px] w-fit text-[#ed0707] flex items-center gap-[4px]">
                                            Warning <OctagonAlert size={10} />
                                        </div>
                                    }
                                </TableCell>
                                <TableCell className="w-[80px]">{log.statusCode}</TableCell>
                                <TableCell className="w-[80px]">{log.latencyMs}</TableCell>
                                <TableCell suppressHydrationWarning className="opacity-[0.7] text-right pr-[20px]">{
                                    (new Date(log.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }</TableCell>
                            </TableRow>
                        ))}
                    </div>

                </Marquee>

            </div>
        </div>
    )
}