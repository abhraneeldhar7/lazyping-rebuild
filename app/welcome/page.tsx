"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import styles from "./animations.module.css"
import { GithubIntegartionPrompt } from "@/components/githubIntegrationPrompt";
import { completeOnboarding } from "../actions/onboarding";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export default function WelcomePage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { session } = useSession();
    const router = useRouter();
    const questions = [
        {
            title: "Define your usecase",
            options: [
                "For personal projects",
                "For project presentation",
                "For production apps"
            ]
        },
        {
            title: "Where did you head about this project from?",
            options: [
                "Twitter",
                "Reddit",
                "Instagram",
            ]
        }
    ]
    return (
        <div className="h-[100vh] w-full p-[15px] flex flex-col gap-[30px] items-center justify-center">
            {currentIndex < questions.length &&
                <h1 className="text-[25px] text-center">Welcome to LazyPing</h1>
            }
            <div className="flex flex-col h-[50vh] max-w-[500px] w-full">
                {currentIndex < questions.length && <>
                    <p className="text-[15px] opacity-[0.8]">{questions[currentIndex].title}</p>
                    <div className="mt-[8px] flex flex-col gap-[8px]" key={currentIndex}>
                        {questions[currentIndex].options.map((option, index) => (
                            <Button variant="ghost" className={`bg-muted/40 border border-primary/20 hover:border-primary/30 h-[45px] ${styles.buttonFadeIn}`} key={index} onClick={async () => {
                                setCurrentIndex(currentIndex + 1)
                                if (currentIndex == 1) {
                                    await completeOnboarding();
                                    await session?.reload();
                                }
                                router.push("/dashboard")
                            }}>
                                {option}
                            </Button>
                        ))}
                    </div>
                </>}
                {currentIndex >= questions.length && <>
                    <GithubIntegartionPrompt />
                </>}
            </div>


        </div>
    )
}