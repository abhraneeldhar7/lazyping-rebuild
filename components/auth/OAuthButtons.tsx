"use client"
import { GithubIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function OAuthButtons() {
    return (
        <div className="flex gap-[8px]">
            <Button className="flex-1 h-[44px]"><Image alt="" src="/login/google.webp" height={18} width={18} /> Google</Button>
            <Button className="flex-1 h-[44px]"><GithubIcon /> Github</Button>
        </div>
    )
}