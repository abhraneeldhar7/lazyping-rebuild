"use client"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { PingLog } from "@/lib/types"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

const mockLogs: PingLog[] = [
    {
        projectId: "LazyPing API",
        endpointId: "end_1",
        url: "https://api.lazyping.com/health",
        method: "GET",
        status: "OK",
        statusCode: 200,
        latencyMs: 145,
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
        projectId: "LazyPing Web",
        endpointId: "end_2",
        url: "https://app.lazyping.com/dashboard",
        method: "DELETE",
        status: "HTTP_5XX",
        statusCode: 500,
        latencyMs: 890,
        timestamp: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
        projectId: "LazyPing API",
        endpointId: "end_1",
        url: "https://api.lazyping.com/v1/auth/verify",
        method: "POST",
        status: "TIMEOUT",
        statusCode: null,
        latencyMs: 5000,
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
        projectId: "DesignEasy",
        endpointId: "end_3",
        url: "https://design-easy.com/api/templates",
        method: "PUT",
        status: "OK",
        statusCode: 201,
        latencyMs: 230,
        timestamp: new Date(Date.now() - 1000 * 60 * 20)
    },
    {
        projectId: "LazyPing Web",
        endpointId: "end_4",
        url: "https://lazyping.com/pricing",
        method: "GET",
        status: "OK",
        statusCode: 200,
        latencyMs: 120,
        timestamp: new Date(Date.now() - 1000 * 60 * 25)
    },
    {
        projectId: "SaaS Rocket",
        endpointId: "end_5",
        url: "https://api.saasrocket.io/v1/billing",
        method: "POST",
        status: "HTTP_4XX",
        statusCode: 403,
        latencyMs: 310,
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
        projectId: "DesignEasy",
        endpointId: "end_6",
        url: "https://design-easy.com/api/assets/upload",
        method: "POST",
        status: "OK",
        statusCode: 200,
        latencyMs: 1450,
        timestamp: new Date(Date.now() - 1000 * 60 * 35)
    }
];

export default function LogsComponent() {
    const isMobile = useIsMobile();



    return (
        <div>
            {/* <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent side={isMobile ? "bottom" : "right"}>
                    <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet> */}


            <div className="">
                <Table>
                    <TableHeader>
                        <TableRow className="opacity-[0.6] text-[12px]">
                            <TableHead>Project Name</TableHead>
                            <TableHead className="w-[200px] md:w-[400px]">URL</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Latency</TableHead>
                            <TableHead className="text-right">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-[12px] cursor-pointer" >
                        {mockLogs.map((log, index) => (
                            <TableRow key={index} className={`border-0 h-[45px] ${index % 2 == 0 && "dark:bg-muted/35 bg-muted"}`}>
                                <TableCell className="pl-[10px]">{log.projectId}</TableCell>

                                <TableCell className="text-[15px]">
                                    <div className="relative max-w-[200px] md:max-w-[400px]">
                                        <p className="absolute top-[50%] left-0 translate-y-[-50%] truncate right-0">{log.url}</p>
                                    </div>
                                </TableCell>

                                <TableCell>{log.method}</TableCell>

                                <TableCell className={`font-[500] ${log.status == "OK" ? "text-[var(--success)]" : "text-destructive"}`}>{log.status}</TableCell>

                                <TableCell>{log.latencyMs}</TableCell>
                                <TableCell className="opacity-[0.7] text-right">{log.timestamp.toLocaleTimeString().toUpperCase()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div >
    )
}