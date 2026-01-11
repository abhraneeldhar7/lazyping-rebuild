import Image from "next/image";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import Link from "next/link";

export default function FooterComponent() {

    return (
        <footer className="h-[50vh] w-full flex  bg-foreground/2 flex-col justify-between text-[15px]">

            <div className="md:p-[50px] p-[15px] flex justify-between gap-[50px] md:flex-row flex-col">
                <div>
                    <Link href="/" className="flex items-center gap-[15px]">
                        <Image src="/appLogo.png" height={28} width={28} alt="" />
                        <h1>LazyPing</h1>
                    </Link>
                    <p className="mt-[15px] max-w-[300px] opacity-[0.8] text-[14px]">LazyPing is a service which pings servers and alerts outages before users notice.</p>
                </div>

                <div className="flex flex-col gap-[10px] md:text-right md:items-end">
                    <Link className="w-fit" href="/privacy-policy">Privacy Policy</Link>
                    <Link className="w-fit" href="https://veryneel.vercel.app" target="_blank">Contact</Link>
                    <Link className="w-fit" href="https://x.com/veryNeel" target="_blank">Blogs</Link>

                </div>

            </div>

            <div className="relative overflow-hidden md:h-[10vw] h-[30vw]">
                <div className="absolute bottom-0 translate-y-[32%] left-0 right-0">
                    <div className="relative flex justify-center items-baseline">
                        <h1 className="md:text-[10vw] text-[30vw] flex items-baseline">
                            <span>Antk</span>
                            <span className="relative inline-block">
                                i
                                <span className="absolute left-1/2 -translate-x-1/2 top-[0.25em] bg-foreground rounded-full text-background p-[4px] h-[0.25em] w-[0.25em] flex items-center justify-center">
                                    <AnimatedThemeToggler />
                                </span>
                            </span>
                            <span className="z-[1]">n</span>
                        </h1>
                        <div className="md:h-[8vw] h-[27vw] bg-gradient-to-t from-background from-[50%] to-transparent to-[100%] absolute bottom-[-4px] z-[2] w-full" />
                    </div>
                </div>
            </div>


        </footer>
    )
}