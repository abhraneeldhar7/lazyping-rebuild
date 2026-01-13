"use client"
import SigninFall from "@/components/signinFall";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignIn } from "@clerk/nextjs";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
// old user
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    return (<div className="flex flex-col gap-[20px] flex-3">
        <div className="md:h-[100px] flex-1 flex items-center justify-center">
            <h1 className="text-[25px]">Log In into your account</h1>
        </div>
        <div className="flex flex-col gap-[7px]">
            <Label>Email</Label>
            <Input placeholder="123123" />
        </div>
        <div className="flex flex-col gap-[7px]">
            <Label>Password</Label>
            <div className="flex gap-[8px]">
                <Input type={showPassword ? "text" : "password"} />
                <Button variant={showPassword ? "default" : "outline"} onClick={() => setShowPassword(!showPassword)} className="w-[37px]"><EyeIcon className="p-[2px]" /></Button>
            </div>
        </div>

    </div>)
}
