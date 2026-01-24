import ChartsThing from "@/components/landingpageComp/chartsThing";
import LogsThing from "@/components/landingpageComp/logsThing";
import PingingCyclingBox from "@/components/landingpageComp/pingingCyclingBox";
import PublicLagesAll from "@/components/landingpageComp/publicPages";
import WorksWithFrameworkThing from "@/components/landingpageComp/worksWithThing";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TextAnimate } from "@/components/ui/text-animate";
import { getTierLimits } from "@/lib/pricingTiers";
import { ChevronRight, CircleCheck, GithubIcon, MenuIcon, XIcon } from "lucide-react";
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


    return <div className="relative font-[Satoshi] overflow-hidden pb-[50px]">

        {/* <PingingCyclingBox className="absolute top-[15px] left-[50%] translate-x-[-50%]" /> */}
        <div className="h-[50px]  fixed top-0 left-0 w-full z-[10] flex items-center px-[15px] justify-between gap-[30px]">
            <Link href={"/"} className="min-w-[27px]">
                <Image src="/appLogo.png" alt="" height={27} width={27} />
            </Link>
            <PingingCyclingBox />
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

        <div className="relative w-full flex flex-col items-center px-[15px] py-[120px] gap-[50px]">
            <BGGridPattern />
            <div></div>
            <div className="flex flex-col gap-[20px]">
                <h1 className="font-[800] md:text-[50px] text-[40px] leading-[1.2em] text-center flex flex-col items-center">
                    <span className="flex gap-[15px]">
                        <span className="bg-foreground text-background px-[10px]">
                            NEVER
                        </span>
                        <span className="font-[600]">
                            LET YOUR
                        </span>
                    </span>
                    <span className="flex gap-[15px] mt-[6px]">
                        <span className="text-primary">
                            SERVERS
                        </span>
                        <span className="relative px-[10px]">
                            <div className="h-[6px] w-full absolute top-[50%] translate-y-[-50%] left-0 bg-[red] z-[2]" />
                            <div className="bg-gradient-to-r from-background to-transparent absolute z-[2] left-0 top-0 h-full w-[12px] " />
                            <div className="bg-gradient-to-l from-background to-transparent absolute z-[2] right-0 top-0 h-full w-[12px] " />
                            <span className="opacity-[0.7] font-[500] ">
                                SLEEP
                            </span>
                        </span>
                    </span>
                </h1>
                <p className="text-[15px] md:text-[18px] opacity-[0.8] px-[10px] text-center">We ping your servers at fixed intervals and alert you of any anomaly</p>
            </div>

            <div className="flex justify-center items-center gap-[10px] md:flex-row flex-col-reverse w-full">

                <Link href="https://github.com/abhraneeldhar7/lazyping" className="md:w-[150px] w-full border rounded-[10px]" target="_blank">
                    <Button variant="ghost" className="text-[15px] md:h-[50px] h-[55px] hover:scale-[1.01] w-full">
                        Open Source <GithubIcon size={17} />
                    </Button>
                </Link>
                <Link href="/login" className="md:w-[140px] w-full">
                    <Button variant="shinny" className="text-[20px] md:h-[50px] h-[55px] hover:scale-[1.01] w-full">Activate</Button>
                </Link>
            </div>

            <div className="max-w-[800px] w-full mx-auto">

                <Image className="w-full h-fit object-contain hidden dark:block" alt="" src="/landingpage/dashboardImgDark.png" height={600} width={600} unoptimized />
                <Image className="w-full h-fit max-w-[800px] object-contain block dark:hidden" alt="" src="/landingpage/dashboardImgLight.png" height={600} width={600} unoptimized />
                <div className="w-full relative">
                    <div className="h-full w-[20px] absolute left-0 bg-gradient-to-r from-background from-[20%] to-transparent z-[2]" />
                    <div className="h-full w-[20px] absolute right-0 bg-gradient-to-l from-background from-[20%] to-transparent z-[2]" />
                    <Marquee className="[--duration:40s]">
                        {smallMarqueeList.map((item, index) => (
                            <div key={index} className="flex items-center gap-[15px]">
                                <p>{item}</p>
                                <div className="bg-foreground h-[4px] w-[4px] opacity-[0.8] rounded-[50%]" />
                            </div>
                        ))}
                    </Marquee>
                </div>
            </div>



        </div>




        <div className="flex gap-[45px] flex-col max-w-[800px] w-full mx-auto">
            <div className="flex-1 px-[15px]">
                <div>
                    <h1 className="text-[24px] md:text-[34px] font-[500]">Detailed Performance Insights</h1>
                    <p className="text-[14px] md:text-[16px]">Track and analyze your server performance with detailed insights and metrics.</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <Image src="/landingpage/chartsImgDarkTop.png" className="w-full h-fit object-contain  hidden dark:block rounded-[15px]" height={500} width={500} alt="" />
                <Image src="/landingpage/chartsImgLightTop.png" className="w-full h-fit object-contain block dark:hidden rounded-[15px]" height={500} width={500} alt="" />
                <div className="mt-[15px] mb-[40px]">
                    <ChartsThing />
                </div>
                {/* <Image src="/landingpage/chartsImgDarkBottom.png" className="w-full h-fit object-contain  hidden dark:block" height={500} width={500} alt="" />
                <Image src="/landingpage/chartsImgLightBottom.png" className="w-full h-fit object-contain block dark:hidden" height={500} width={500} alt="" /> */}
                <LogsThing />
            </div>
        </div>


        <div className="flex justify-between flex-col relative h-[55vh] md:h-[100vh] w-full mt-[80px] p-[20px]">
            <TextAnimate className="md:absolute leading-[1.2em] top-[10%] left-[5%] md:text-[70px] text-[35px] text-center font-[600]" animation="slideUp" as="h1">
                Public Status Page
            </TextAnimate>
            <TextAnimate delay={0.2} className="md:block hidden absolute bottom-[50px] right-[5%] text-[50px] text-right font-[600] z-[3]" animation="slideUp" as="h1">
                Never keep users guessing
            </TextAnimate>
            <Image src="/landingpage/mockup.png" height={500} width={500} className="absolute bottom-0 h-[90%] md:h-[85%] object-bottom object-contain w-fit left-[50%] translate-x-[-50%]" alt="" />
            <div className="bg-gradient-to-t from-background to-transparent absolute z-[2] bottom-0 left-0 right-0 h-[60px] w-full" />
        </div>

        {/* <div className="flex flex-col gap-[10px] mb-[50px] px-[15px] md:px-[40px] w-full">
            <h1 className="text-[20px] opacity-[0.8]">Examples</h1>
            <PublicLagesAll />
        </div> */}

        <div id="pricing" className="flex justify-center my-[50px]" >
            <Link href="/login" className="w-fit mb-[60px]">
                <Button variant="shinny" className="md:w-[140px] w-full text-[20px] md:h-[50px] h-[55px] hover:scale-[1.01]">Get Started</Button>
            </Link>
        </div>

        <div className="flex gap-[25px] flex-col max-w-[800px] w-full mx-auto px-[15px]">
            <div className="flex-1">
                <div>
                    <h1 className="text-[24px] md:text-[34px] font-[500]">Pricing</h1>
                    <p className="text-[14px] md:text-[16px]">I just added pricing to learn payment gateways. You can always fork the repo and host it yourself for free.</p>
                </div>
            </div>

            <div className="flex gap-[15px] md:flex-row flex-col">
                <div className="flex-1 flex flex-col rounded-[5px] border p-[15px] pt-[10px] bg-muted">
                    <div className="flex justify-between">
                        <h1 className="text-[24px]">Free plan</h1>
                        <h1 className="text-[30px]">${getTierLimits("FREE").pricing_per_month.usd}</h1>
                    </div>
                    <div className="flex flex-col gap-[15px] text-[16px] leading-[1em] mt-[10px]">
                        <p className="flex gap-[10px]"><CircleCheck size={17} className="text-[var(--success)]" /> {getTierLimits("FREE").max_projects} projects</p>
                        <p className="flex gap-[10px]"><CircleCheck size={17} className="text-[var(--success)]" /> {getTierLimits("FREE").max_endpoints_per_project} endpoints per project</p>
                        <p className="flex gap-[10px]"><CircleCheck size={17} className="text-[var(--success)]" /> {getTierLimits("FREE").max_history_days} days performance history</p>
                    </div>
                </div>


                <div className="flex-1 flex flex-col rounded-[5px] border p-[15px] pt-[10px] bg-muted">
                    <div className="flex justify-between">
                        <h1 className="text-[26px]"><span className="text-[var(--primary)]">Pro</span></h1>
                        <h1 className="text-[30px]">${getTierLimits("PRO").pricing_per_month.usd}</h1>
                    </div>
                    <div className="flex flex-col gap-[15px] text-[16px] leading-[1em] mt-[10px]">
                        <p className="flex gap-[10px]"><CircleCheck size={17} className="text-[var(--success)]" /> {getTierLimits("PRO").max_projects} projects</p>
                        <p className="flex gap-[10px]"><CircleCheck size={17} className="text-[var(--success)]" /> {getTierLimits("PRO").max_endpoints_per_project} endpoints per project</p>
                        <p className="flex gap-[10px]"><CircleCheck size={17} className="text-[var(--success)]" /> {getTierLimits("PRO").max_history_days} days performance history</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
}