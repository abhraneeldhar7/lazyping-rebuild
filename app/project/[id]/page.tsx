import AddEndpointBtn from "@/components/addEndpoint/addEndpoint";
import BarUptime from "@/components/barUptime";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPopoverComponent } from "@/components/userPopover";
import { CheckIcon, ChevronRight, Github, NetworkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectPage() {
    const projectTabs = [
        { label: "Overview" },
        { label: "Logs" },
        { label: "Settings" },
    ]

    return (<div className="relative min-h-[100vh] pt-[90px] pb-[50px] overflow-x-hidden">

        <div className="rounded-[50%] w-[120%] h-[20vh] left-[50%] translate-x-[-50%] absolute top-[-15vh] bg-accent z-[-1] opacity-[0.4] blur-[70px] animate-pulse" />


        <div className="fixed top-0 bg-background z-[10] w-full border-b-[1px] border-foreground/20 h-[50px] flex items-center p-[5px] px-[10px] gap-[15px]">
            <Link href="/dashboard">
                <Image src="/appLogo.png" alt="" height={30} width={30} unoptimized />
            </Link>
            <div className="flex gap-[10px] items-center">
                <ChevronRight size={14} className="opacity-[0.3]" />
                <p className="text-[15px]">ProjectName</p>
                <NetworkIcon size={16} />
            </div>
            <div className="ml-auto">
                <UserPopoverComponent />
            </div>
        </div>

        <div className="fixed flex px-[15px] items-center top-[50px] h-[40px] backdrop-blur-[20px] bg-background/50 w-full z-[10]">
            {projectTabs.map((tab, index) => (
                <Button variant="ghost" key={index} className="font-[400] rounded-[4px] h-[30px] text-[12px]">{tab.label}</Button>
            ))}
        </div>


        <div className="mx-auto max-w-[1000px] h-[500px] px-[15px] ">

            {/* <div className="rounded-[10px] border-[2px] bg-[#f72424]/20 dark:bg-[#f72424]/12 border-[#f72424]/10 p-[15px] relative my-[20px]">
                <X className="absolute right-[10px] top-[10px] hover:bg-background/40 cursor-pointer rounded-[50%] p-[3px]" size={22} />
                <h1 className="text-[18px]">Warning</h1>
                <p className="text-[15px] opacity-[0.9] mt-[5px]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae error, illo ipsa tempora in delectus soluta minima! Recusandae, dolores rerum?</p>
            </div> */}


            <div className="flex my-[30px] md:flex-row flex-col gap-[30px]">
                <div className="flex-1">
                    <h1 className="text-[24px]">ProjectName</h1>
                    <Button className="mt-[15px]" variant="outline"><Github /> Repository</Button>
                </div>

                <div className="flex-1 flex flex-col items-center gap-[10px]">
                    <div className="flex flex-col gap-[10px]">
                        {/* <p className="text-[12px] opacity-[0.7] text-right w-full">Last pinged 5min ago</p> */}

                        <BarUptime />
                    </div>

                    <p className="text-[12px] opacity-[0.7] text-center w-full">Last pinged 5min ago</p>
                </div>
            </div>

            <div className="my-[30px]">
                <ChartAreaInteractive />
            </div>


            <div className="flex flex-col gap-[10px] items-center">
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

        </div>


    </div >)
}