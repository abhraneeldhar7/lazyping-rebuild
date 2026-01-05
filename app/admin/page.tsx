"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { processScheduledPings } from "../actions/systemActions"

export default function TestAdminPage() {
    const [res, setRes] = useState("")
    return (
        <div className="flex flex-col gap-2 items-center justify-center h-screen p-[15px]">
            <Button onClick={async () => {
                const res = await processScheduledPings()
                setRes(JSON.stringify(res))
            }}>Ping all</Button>
            <p className="max-w-[450px]">{res}</p>
        </div>
    )
}