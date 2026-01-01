"use client"

import React, { forwardRef, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { AnimatedBeam } from "./ui/animated-beam"
import Image from "next/image"
import { Button } from "./ui/button"
import { GithubIcon } from "lucide-react"
import Link from "next/link"

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3",
                className
            )}
        >
            {children}
        </div>
    )
})

Circle.displayName = "Circle"

function GithubIntegartionAnimation() {
    const containerRef = useRef<HTMLDivElement>(null)
    const div1Ref = useRef<HTMLDivElement>(null)
    const div2Ref = useRef<HTMLDivElement>(null)

    return (
        <div
            className="relative flex w-full max-w-[400px] mx-auto items-center justify-center overflow-hidden"
            ref={containerRef}
        >
            <div className="flex size-full flex-col items-stretch justify-between gap-10">
                <div className="flex justify-between">
                    <div ref={div1Ref} className="h-12 w-12 z-[10] p-1">
                        <Image src="/appLogo.png" className="bg-background rounded-[10px] h-full w-full object-contain" alt="" preload height={40} width={40} />
                    </div>
                    <Circle ref={div2Ref} >
                        <GithubIcon className="text-[black]" />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div2Ref}
                startYOffset={10}
                endYOffset={10}
                curvature={-20}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div2Ref}
                startYOffset={-10}
                endYOffset={-10}
                curvature={20}
                reverse
            />
        </div>
    )
}


export function GithubIntegartionPrompt() {

    return (<div className="dark:bg-muted/60 bg-muted border shadow-md rounded-[22px] mx-auto w-full max-w-[400px] flex flex-col justify-between md:h-[44vh] h-[38vh]">

        <div className="md:p-[35px] p-[25px] pb-0 h-full flex flex-col">
            <h2 className="text-center text-[25px]">Connect to Github</h2>
            <p className="text-[15px] opacity-[0.8] text-center mt-[5px]">For more benifits</p>
            <div className="flex items-center flex-1">
                <GithubIntegartionAnimation />
            </div>
        </div>

        <div className="flex gap-[8px] md:flex-row flex-col-reverse p-[15px] pt-0">
            <Link href="/dashboard" className="flex-1">
                <Button variant="secondary" className="w-full rounded-[7px]">Cancel</Button>
            </Link>
            <Button className="flex-1 rounded-[7px]" >Authenticate</Button>
        </div>

    </div>)
}
