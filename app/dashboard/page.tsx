import NewProjectBtn from "@/components/addProjectBtn";
import ProjectCard from "@/components/projectCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPopoverComponent } from "@/components/userPopover";
import { CheckCircle, ChevronRight, PackageOpen, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {



    return (

        <div>


            <div className="border bg-muted/60 rounded-[5px] md:h-[50px] h-[45px] w-full flex md:pl-[20px] p-[6px] pl-[10px] items-center gap-[10px] relative">
                <div className="text-[var(--success)] text-[11px] bg-background absolute top-[-10px] py-[4px] leading-[1em] px-[7px] left-[8px] border rounded-[5px]">
                    Next ping
                </div>

                <div className="border border-foreground/40 rounded-[5px] absolute bottom-[-1px] left-[30px] right-[30px]" />

                <div className="flex items-center flex-1 md:gap-[15px] gap-[6px]">
                    {/* <p className=" text-[14px] opacity-[0.8] truncate md:max-w-[200px] max-w-[100px]">Project Nameaaa</p>
                        <ChevronRight size={17} className="opacity-[0.5]" />
                        <div className="relative flex-1 h-[1.2em]">
                            <p className="text-[12px] opacity-[0.6] truncate absolute left-0 right-0">/api/websoohkss/ss/sclerk/mencne/ce/e/asidhshda/r</p>
                        </div> */}
                    <p className="text-[14px] opacity-[0.7]">No scheduled pings</p>
                </div>


                {/* <div className="flex items-center justify-center text-[var(--success)] bg-secondary shadow-md w-[70px] md:w-[80px] rounded-[4px] h-full text-[14px]">
                        <p>00:50s</p>
                    </div> */}
            </div>

            <div className="flex md:flex-row flex-col md:gap-[30px] gap-[20px] mt-[30px]">

                <div className="flex flex-col gap-[20px] w-full max-w-[400px]">
                    <div className="">
                        <Label className="pl-[5px]">Alert</Label>
                        <div className={`rounded-[6px] border border-border/40 w-full mt-[10px] bg-muted dark:bg-muted/80 p-[4px] flex flex-col gap-[4px]`}>

                            {/* <div className="h-[50px] rounded-[2px] border border-[var(--error)]/18 bg-[var(--error)]/8 flex items-center px-[10px] text-[14px] gap-[10px]">
                                    <XCircle size={16} className="text-[var(--error)]" />
                                    <p className="opacity-[0.5] truncate w-[90px]">Project Name</p>
                                    <ChevronRight size={14} className="opacity-[0.7]" />
                                    <p className="opacity-[0.9] flex-1 truncate">Error in endpoint</p>
                                    <p className="opacity-[0.8] text-[12px] pr-[4px]">3 am</p>
                                </div>


                                <Button className="w-full h-[30px] text-[12px]" variant="ghost">More</Button> */}

                            <div className="h-[100px] bg-[var(--success)]/5 rounded-[4px] flex items-center justify-center border-[2px] border-[var(--success)]/10 gap-[10px]">
                                <p className="text-[14px] leading-[1em]">
                                    No alerts so far
                                </p>
                                <CheckCircle size={16} className="text-[var(--success)]" />
                            </div>

                        </div>
                    </div>

                    <div className="">
                        <Label className="pl-[5px]">Recent</Label>
                        <div className="rounded-[6px] border-border/40 border w-full mt-[10px] bg-muted dark:bg-muted/80 text-[14px] p-[4px] flex flex-col gap-[4px]">

                            {/* <div className="h-[50px] rounded-[2px] border flex items-center px-[10px] text-[14px] gap-[10px] border-[var(--error)]/18 bg-[var(--error)]/8">
                                    <XCircle size={16} className="text-[var(--error)]" />
                                    <p className="opacity-[0.7] truncate flex-1">Projecaedomain.com/api/something/something</p>
                                    <div>
                                        <p className="text-[12px] text-[var(--error)]/90 bg-[var(--error)]/30 rounded-[10px] leading-[1em] py-[4px] px-[8px]">Timeout</p>
                                    </div>
                                </div>
                                <div className="h-[50px] rounded-[2px] border flex items-center px-[10px] text-[14px] gap-[10px] border-[var(--success)]/18 bg-[var(--success)]/8">
                                    <CheckCircle size={16} className="text-[var(--success)]/80" />
                                    <p className="opacity-[0.7] truncate flex-1">Projecaedomain.com/api/something/something</p>
                                    <div>
                                        <p className="text-[12px] text-[var(--success)] bg-[var(--success)]/30 rounded-[10px] leading-[1em] py-[4px] px-[8px]">200 ok</p>
                                    </div>
                                </div>


                                <Button className="w-full h-[30px] text-[12px]" variant="ghost">More</Button> */}

                            <div className="h-[100px] opacity-[0.8] rounded-[4px] flex items-center justify-center gap-[10px]">
                                <p className="text-[14px] leading-[1em]">
                                    No recent pings
                                </p>
                                <PackageOpen size={18} />
                            </div>


                        </div>

                    </div>

                    {/* <Image src="https://s1.r29static.com/bin/entry/b0a/0,0,818,981/720x864,85/1473242/image.webp" className="w-[200px] mx-auto" alt="" height={800} width={200}/> */}
                </div>

                <div className="w-full">
                    <Label className="pl-[5px]">Projects</Label>
                    <div className="flex flex-col items-center mt-[10px] justify-center p-[40px] rounded-[10px] border mb-[20px] shadow-sm bg-gradient-to-r from-muted via-background to-muted">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-[10px]">
                            <rect x="3" y="7" width="18" height="13" rx="3" fill="currentColor" fillOpacity="0.12" />
                            <rect x="7" y="3" width="10" height="4" rx="2" fill="currentColor" fillOpacity="0.22" />
                            <rect x="9" y="10" width="6" height="2" rx="1" fill="currentColor" />
                        </svg>

                        <p className="text-[14px] mb-[15px] text-muted-foreground opacity-[0.8]">
                            Create your first project to start monitoring.
                        </p>
                        <NewProjectBtn />
                    </div>


                    <div className="grid h-fit md:grid-cols-2 grid-cols-1 gap-[20px] flex-1">
                            <ProjectCard />
                            <ProjectCard />
                            <ProjectCard />
                            <ProjectCard />
                        </div>
                </div>

            </div>
        </div>)
}