"use client"
import OAuthButtons from "@/components/auth/OAuthButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// old user
export default function LoginPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                toast.success("Logged in successfully");
                router.push("/dashboard");
            } else {
                console.error(JSON.stringify(result, null, 2));
                toast.error("Something went wrong. Please check your credentials.");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.errors?.[0]?.message || "Failed to log in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center gap-[25px]">
            <form onSubmit={handleLogin} className="flex flex-col gap-[20px] flex-3">
                <div className="md:h-[100px] flex-1 flex items-center justify-center">
                    <h1 className="text-[27px] font-[500] font-[Satoshi]">Log In into your account</h1>
                </div>
                <div className="flex flex-col gap-[7px]">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        placeholder="ryangosling@harvard.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="flex flex-col gap-[7px]">
                    <Label>Password</Label>
                    <div className="flex gap-[8px]">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <Button
                            type="button"
                            variant={showPassword ? "default" : "outline"}
                            onClick={() => setShowPassword(!showPassword)}
                            className="w-[37px]"
                        >
                            <EyeIcon className="p-[2px]" />
                        </Button>
                    </div>
                </div>
                <Button loading={isLoading} className="w-full h-[45px] mt-[10px]" type="submit">
                    Log In
                </Button>
            </form>
            <div className="flex-2 flex flex-col gap-[25px]">
                <p className="mx-auto text-[12px] ">OR</p>
                <OAuthButtons />
                <Link href="/signup" className="mx-auto opacity-[0.7]">Don't have an account? <span className="underline">Sign Up</span></Link>
            </div>
        </div>
    )
}

