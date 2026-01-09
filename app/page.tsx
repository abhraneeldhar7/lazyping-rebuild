"use client"
import ChartsThing from "@/components/landingpageComp/chartsThing";
import LogsThing from "@/components/landingpageComp/logsThing";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerIcon, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {

    const smallMarqueeList = ["Anti Sleep", "Performance Tracker", "Down Detector", "Public status page", "Latency tracker", "Alert Integrations"]


    return <div className="relative pb-[50px] font-[Satoshi]">

        <div className="h-[50px] backdrop-blur-[30px] fixed top-0 left-0 w-full z-[10] flex items-center px-[15px] justify-between">
            <Link href="/" className="md:hidden">
                <Image src="/appLogo.png" alt="" height={27} width={27} />
            </Link>
            <div />
            <div className="md:block hidden">
                <div className="flex gap-[30px] text-[15px]">
                    <Link href="#features">Features</Link>
                    <Link href="#pricing">Pricing</Link>
                    <Link href="/blogs">Blogs</Link>
                </div>
            </div>
            <div className="hidden md:block" />
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <MenuIcon size={25} />
                    </SheetTrigger>
                    <SheetContent side="right" className="border-0 outline-0 ring-0 bg-background/70 dark:bg-background/5 backdrop-blur-[25px] p-[20px] w-full">
                        <SheetHeader className="hidden">
                            <SheetTitle /><SheetDescription />
                        </SheetHeader>
                        <div className="flex justify-end">
                            <SheetClose asChild><XIcon size={25} /></SheetClose>
                        </div>

                        <div className="flex flex-col justify-between h-full px-[10px]">
                            <div className="text-[40px] flex flex-col gap-[10px]">
                                <Link href="/login">Login</Link>
                                <SheetClose asChild>
                                    <Link href="#features">Features</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="#pricing">Pricing</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="/blogs">Blogs</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="https://veryneel.vercel.app" target="_blank">Contact</Link>
                                </SheetClose>
                            </div>

                            <div className="text-center">
                                <p className="opacity-[0.7]">Designed and made by</p>
                                <Link href="https://veryneel.vercel.app" target="_blank" className="text-[17px] underline">meeeee</Link>
                            </div>
                        </div>

                    </SheetContent>
                </Sheet>
            </div>
        </div>

        <div className="md:h-[100vh] h-[70vh] overflow-hidden relative w-full flex flex-col pt-[50px] justify-end items-center gap-[30px] md:gap-[20px]">

            <div className="absolute top-0 z-[-2] w-full h-[40vh]">
                <div className="relative w-full h-full">
                    <div className="opacity-[0.15] dark:opacity-[0.08] w-full h-full bg-background bg-[linear-gradient(to_right,var(--foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--foreground)_1px,transparent_1px)] bg-size-[30px_30px]" />
                    <div className="h-full w-full absolute bottom-0 bg-gradient-to-t from-background from-[30%] to-transparent z-[2]" />
                </div>
            </div>



            <div className="flex flex-col gap-[20px] items-center z-[2]">

                <h1 className="font-[800] md:text-[50px] text-[40px] leading-[1.2em] text-center flex flex-col items-center">
                    <span className="flex gap-[15px]">
                        <span>
                            NEVER
                        </span>
                        <span className="opacity-[0.8] font-[600]">
                            LET YOUR
                        </span>
                    </span>
                    <span className="flex gap-[15px]">
                        <span className="text-primary">
                            SERVERS
                        </span>
                        <span className="relative px-[10px]">
                            <div className="h-[7px] w-full absolute top-[50%] translate-y-[-50%] left-0 bg-[red] z-[2]" />
                            <span className="opacity-[0.8]">
                                SLEEP
                            </span>
                        </span>
                    </span>
                </h1>

                <Button variant="shinny" className="rounded-[0px] text-[24px] h-[50px] leading-[1em] px-[25px]">Activate</Button>

            </div>

            <div className="px-[10px] z-[2]">
                <Image alt="" src="/landingpage/dashboardImg.png" height={400} width={600} className="object-contain max-w-[800px] w-full transition-all duration-300 hover:translate-y-[0px] md:translate-y-[10px]" unoptimized preload />
            </div>

            <div className="h-[80vh] w-[90%] bottom-[-10%] translate-y-[50%] translate-x-[-50%] left-[50%] bg-primary absolute rounded-[50%] blur-[200px] dark:opacity-[0.8] animate-pulse" />

        </div>

        <div className="md:mx-[40px] my-[5px] relative">
            <div className="h-full w-[20px] absolute left-0 bg-gradient-to-r from-background from-[20%] to-transparent z-[2]" />
            <div className="h-full w-[20px] absolute right-0 bg-gradient-to-l from-background from-[20%] to-transparent z-[2]" />
            <Marquee className="[--duration:25s]">
                {smallMarqueeList.map((item, index) => (
                    <div key={index} className="flex items-center gap-[15px]">
                        <p>{item}</p>
                        <div className="bg-foreground h-[4px] w-[4px] opacity-[0.8] rounded-[50%]" />
                    </div>
                ))}
            </Marquee>
        </div>

        <div className="flex flex-col md:flex-row gap-[60px] mx-auto  md:px-[40px] w-full md:mt-[100px] mt-[50px] md:justify-between max-w-[1400px]">

            <div className="md:flex-2 flex flex-col gap-[50px] md:gap-[70px] max-w-[520px]">
                <ChartsThing />
                <LogsThing />
            </div>

            <div className="md:flex-3 flex flex-col relative items-center justify-between h-[400px] md:h-[500px] overflow-hidden" >
                <div className="border rounded-[30px] py-[8px] px-[16px] leading-[1em] text-[14px] flex items-center  gap-[12px] bg-muted shadow-md">
                    <div className="bg-[var(--success)] h-[7px] w-[7px] rounded-[50%] animate-pulse" />
                    3000 pings so far
                </div>

                <div className="z-[3] absolute bottom-[10%] flex flex-col gap-[20px] items-center">
                    <p className="text-white mix-blend-difference">Works with <span className="font-[600]">every </span>framework</p>

                    <div className="relative">
                        <div className="h-full w-[60px] absolute left-0 bg-gradient-to-r from-background from-[20%] to-transparent z-[2]" />
                        <div className="h-full w-[60px] absolute right-0 bg-gradient-to-l from-background from-[20%] to-transparent z-[2]" />

                        <Marquee className="[--duration:20s] max-w-[400px] w-full">
                            <div className="px-[10px]">
                                <Image alt="" src="/landingpage/serverFrameworks/expressjs.png" height={40} width={40} />
                            </div>
                            <div className="px-[10px]">
                                <Image alt="" src="/landingpage/serverFrameworks/fastapi.svg" height={40} width={40} />
                            </div>
                            <div className="px-[10px]">
                                <Image alt="" src="/landingpage/serverFrameworks/goLogo.png" height={40} width={40} />
                            </div>
                            <div className="px-[10px]">
                                <Image alt="" src="/landingpage/serverFrameworks/NestJS.svg" height={40} width={40} />
                            </div>
                        </Marquee>
                    </div>
                </div>


                <Image src="/landingpage/coolDude.png" height={400} width={400} className="object-contain w-fit h-[350px] md:h-[450px] absolute bottom-0 translate-x-[-10px]" alt="" unoptimized />
                <div className="h-[60px] w-full absolute bottom-0 bg-gradient-to-t from-background from-[0%] to-transparent to-[100%] z-[2]" />

            </div>

        </div>



    </div>
}