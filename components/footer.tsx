import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { auth } from "@clerk/nextjs/server";
import { Button } from "./ui/button";

export default async function FooterComponent() {
    const { userId } = await auth();

    return (
        <footer className="h-[50vh] w-full flex md:p-[30px] p-[15px] bg-muted dark:bg-muted/70 flex-col justify-between">
            <div className="flex justify-between">
                {userId ?
                    <Image src="/appLogo.png" alt="" height={30} width={30} className="object-contain w-[40px] h-[40px]" /> :
                    <Link href="/login" className="">
                        <Button variant="shinny">Login</Button>
                    </Link>
                }

                <AnimatedThemeToggler />

            </div>


            <h1 className="text-[24px] font-[600] text-center">Lazy Ping</h1>

            <div className="flex justify-between">

                <div className="flex flex-col gap-[6px] text-[15px]">
                    <Link href="https://veryneel.vercel.app" target="_blank" className="flex gap-[6px] items-center">
                        Contact
                        <ArrowUpRight size={15} />
                    </Link>
                    <Link href="https://x.com/veryNeel" target="_blank" className="flex gap-[6px] items-center">
                        Twitter
                        <ArrowUpRight size={15} />
                    </Link>
                </div>


                <Image src="/antkinLogo.png" alt="" height={30} width={30} className="object-contain w-[40px] h-[40px] dark:invert" />
            </div>
        </footer>
    )
}