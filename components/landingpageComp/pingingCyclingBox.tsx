"use client"
import { useEffect, useState } from "react"
import { CircleCheckBigIcon, CircleXIcon, LoaderIcon, RadioIcon } from "lucide-react"
import { getTotalPingCount } from "@/app/actions/pingActions"

export default function PingingCyclingBox({ className }: { className?: string }) {
    const displayMessages = ["Pinging endpoint", "Checking response", "Checking latency", "Success", "Pinging endpoint", "Error", "total_pings"]
    const [currentIndex, setCurrentIndex] = useState(0)
    const [totalPings, setTotalPings] = useState<number | null>(null)

    useEffect(() => {
        const fetchPings = async () => {
            try {
                const count = await getTotalPingCount()
                setTotalPings(count)
            } catch (error) {
                console.error("Failed to fetch pings:", error)
            }
        }
        fetchPings()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayMessages.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [displayMessages.length])

    return (
        <div className={`text-[12px] rounded-[20px] bg-muted dark:bg-muted/40 max-w-[300px] w-full h-[32px] flex items-center flex-col border backdrop-blur-[10px] px-[10px] leading-[1em] overflow-hidden ${className}`}>
            {displayMessages.map((msg, index) => (
                <div
                    className={`flex items-center gap-[7px] overflow-hidden transition-all duration-300 ease-in-out ${currentIndex === index ? "h-[32px] opacity-100" : "h-0 opacity-0"
                        }`}
                    key={index}
                >
                    <div className="min-w-[15px] h-full flex items-center">
                        {msg == "Pinging endpoint" && <RadioIcon size={16} className="animate-pulse text-[var(--success)]" />}
                        {msg == "Checking response" && <LoaderIcon size={16} className="animate-spin text-muted-foreground" />}
                        {msg == "Checking latency" && <LoaderIcon size={16} className="animate-spin text-muted-foreground" />}
                        {msg == "Success" && <CircleCheckBigIcon size={16} className="text-[var(--success)]" />}
                        {msg == "Error" && <CircleXIcon size={16} className="text-[var(--error)]" />}
                    </div>
                    {msg == "total_pings" ? (
                        <div className="flex items-center gap-[7px]">
                            <div className="bg-[var(--success)] h-[8px] w-[8px] rounded-[50%] animate-pulse min-w-[8px]" />
                            <p className="whitespace-nowrap">{totalPings !== null ? `${totalPings} pings so far` : "..."}</p>
                        </div>
                    ) : <p className="whitespace-nowrap">{msg}</p>}
                </div>
            ))}
        </div>
    )
}
