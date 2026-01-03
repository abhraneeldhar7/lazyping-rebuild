"use client"
import AddEndpointBtn from "@/components/addEndpoint/addEndpoint";
import BarUptime from "@/components/barUptime";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import { useProject } from "@/components/projectContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, Github } from "lucide-react";

export default function ProjectPage() {
    const projectData = useProject();

    return (
        <>
            {/* <div className="rounded-[10px] border-[2px] bg-[#f72424]/20 dark:bg-[#f72424]/12 border-[#f72424]/10 p-[15px] relative my-[20px]">
                <X className="absolute right-[10px] top-[10px] hover:bg-background/40 cursor-pointer rounded-[50%] p-[3px]" size={22} />
                <h1 className="text-[18px]">Warning</h1>
                <p className="text-[15px] opacity-[0.9] mt-[5px]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae error, illo ipsa tempora in delectus soluta minima! Recusandae, dolores rerum?</p>
            </div> */}


            <div className="flex mb-[30px] md:flex-row flex-col gap-[30px]">
                <div className="flex-1">
                    <h1 className="text-[24px]">{projectData?.projectName}</h1>
                    <Button className="mt-[15px]" variant="outline"><Github /> Repository</Button>
                </div>

                <div className="flex-1 flex flex-col items-center md:items-end gap-[10px]">
                    <div className="flex flex-col gap-[10px]">
                        <BarUptime />
                        <p className="text-[12px] opacity-[0.7] text-center w-full">Last pinged 5min ago</p>
                    </div>
                </div>
            </div>

            <div className="my-[30px]">
                <ChartAreaInteractive />
            </div>


            <div className="flex flex-col gap-[25px] items-center">
                {/* <p className="opacity-[0.7] font-[300] text-[14px]">Add endpoints to your project to keep them warm</p> */}
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
                        <TableRow className="cursor-pointer select-none">
                            <TableCell className="">
                                <div className="max-w-[250px] relative h-[1.5em]">
                                    <p className="absolute top-0 left-0 right-0 truncate">
                                        /api/health/123/sdasd/123/asd/123123/asdasd
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="rounded-[20px] bg-[#00ff9e]/30 border-[1px] py-[4px] leading-[1em] w-fit px-[7px] text-[12px] flex gap-[6px]">
                                    Active
                                    <CheckIcon size={12} />
                                </p>
                                {/* <p className="rounded-[20px] bg-[#ed0707]/30 border-[1px] py-[4px] leading-[1em] w-fit px-[7px] text-[12px] flex gap-[6px]">
                                    Warning
                                    <OctagonAlert size={12}/>
                                </p> */}
                            </TableCell>
                            <TableCell>5min</TableCell>
                            <TableCell className="text-right"></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {/* <div className="flex flex-col items-center gap-[15px] bg-muted/40 px-[15px] py-[30px] w-full rounded-[8px] border">
                    <StickerIcon size={30} />
                    <p>No endpoints added for this project</p>
                </div> */}
                <AddEndpointBtn />
            </div>
        </>
    )
}