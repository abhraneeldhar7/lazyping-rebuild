import ChartsThing from "@/components/landingpageComp/chartsThing";
import LogsThing from "@/components/landingpageComp/logsThing";
import PingingCyclingBox from "@/components/landingpageComp/pingingCyclingBox";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TextAnimate } from "@/components/ui/text-animate";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function BGGridPattern() {
    return (<div className="absolute top-0 z-[-2] w-full h-[50vh] md:h-[40vh]">
        <div className="relative w-full h-full">
            <div className="opacity-[0.15] dark:opacity-[0.1] w-full h-full bg-background bg-[linear-gradient(to_right,var(--foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--foreground)_1px,transparent_1px)] bg-size-[30px_30px]" />
            <div className="h-full w-full absolute bottom-0 bg-gradient-to-t from-background from-[30%] to-transparent z-[2]" />
        </div>
    </div>)
}

export default function RootPage() {

    const smallMarqueeList = ["Anti Sleep", "Performance Tracker", "Down Detector", "Public status page", "Latency tracker", "Alert Integrations"]


    return <div className="relative font-[Satoshi]">

        <PingingCyclingBox className="hidden md:flex absolute top-[15px] left-[50%] translate-x-[-50%]" />
        <div className="h-[50px] backdrop-blur-[3px] fixed top-0 left-0 w-full z-[10] flex items-center px-[15px] justify-between gap-[30px] md:hidden">
            <Link href="/" className="md:hidden">
                <Image src="/appLogo.png" alt="" height={27} width={27} />
            </Link>
            <PingingCyclingBox />
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

        <div className="md:h-[100vh] h-[90vh] overflow-hidden relative w-full flex flex-col pt-[50px] md:justify-center justify-between items-center gap-[50px] md:gap-[20px] px-[15px] py-[40px]">

            <BGGridPattern />
            <div></div>
            <div className="py-[30px]">
                <h1 className="font-[800] md:text-[50px] text-[40px] leading-[1.2em] text-center flex flex-col items-center">
                    <span className="flex gap-[15px]">
                        <span>
                            NEVER
                        </span>
                        <span className="font-[600]">
                            LET YOUR
                        </span>
                    </span>
                    <span className="flex gap-[15px]">
                        <span className="text-primary">
                            SERVERS
                        </span>
                        <span className="relative px-[10px]">
                            <div className="h-[7px] w-full absolute top-[50%] translate-y-[-50%] left-0 bg-[red] z-[2]" />
                            <span className="opacity-[0.7] font-[500] ">
                                SLEEP
                            </span>
                        </span>
                    </span>
                </h1>
            </div>

            <Link href="/login">
                <Button variant="shinny" className="text-[20px] md:h-[50px] h-[55px] hover:scale-[1.01] md:w-[140px] w-full">Activate</Button>
            </Link>








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

        <div className="flex flex-col md:flex-row mt-[100px] gap-[60px] mx-auto md:px-[40px] w-full md:justify-around max-w-[1400px]">

            <div className="flex flex-1 flex-col gap-[100] max-w-[520px]">
                <ChartsThing />
                <LogsThing />
            </div>

            <div className="flex-1 flex flex-col relative items-center justify-between h-[400px] md:h-[500px] overflow-hidden" >


                <Image src="/landingpage/coolDude.png" height={400} width={400} className="object-contain w-fit h-[350px] md:h-[450px] absolute bottom-0" alt="" unoptimized />
                <div className="h-[60px] w-full absolute bottom-0 bg-gradient-to-t from-background from-[0%] to-transparent to-[100%] z-[2]" />

                <div className="absolute bottom-[10%] flex flex-col gap-[20px] items-center">
                    <p className="text-[white] mix-blend-difference text-[20px]">Works with <span className="font-[600]">every </span>framework</p>

                    <div className="relative">
                        <div className="h-full w-[40px] absolute left-0 bg-gradient-to-r from-background from-[20%] to-transparent z-[2]" />
                        <div className="h-full w-[40px] absolute right-0 bg-gradient-to-l from-background from-[20%] to-transparent z-[2]" />

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
            </div>

        </div>

        <div className="flex justify-between flex-col relative h-[53vh] md:h-[100vh] w-full mt-[80px] p-[20px]">
            <TextAnimate className="md:absolute leading-[1.2em] top-[10%] left-[5%] md:text-[70px] text-[40px] text-center font-[600]" animation="slideUp" as="h1">
                Public Status Page
            </TextAnimate>
            <TextAnimate delay={0.2} className="md:absolute bottom-[10%] right-[5%] md:text-[50px] text-[38px] text-center md:text-right font-[600] z-[2]" animation="slideUp" as="h1">
                Never keep users guessing
            </TextAnimate>
            <Image src="/landingpage/mockup.png" height={500} width={500} className="absolute bottom-0 h-[90%] md:h-[85%] object-bottom object-contain w-fit left-[50%] translate-x-[-50%]" alt="" unoptimized />
        </div>


    </div>
}