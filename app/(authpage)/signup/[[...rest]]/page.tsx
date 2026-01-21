"use client"
import OAuthButtons from "@/components/auth/OAuthButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useSignUp } from "@clerk/nextjs";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// new user
export default function SignupPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting signup...");
        if (!isLoaded) return;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const [firstName, ...lastNameParts] = fullName.split(" ");
            const lastName = lastNameParts.join(" ") || null; // Clerk might require lastName

            let newUserObj;
            if (lastName) {
                newUserObj = {
                    firstName,
                    lastName,
                    emailAddress: email,
                    password
                }
            }
            else {
                newUserObj = {
                    firstName,
                    emailAddress: email,
                    password
                }
            }
            await signUp.create(newUserObj);

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setPendingVerification(true);
            toast.success("Verification code sent to your email");
        } catch (err: any) {
            console.error("Signup error:", err);
            toast.error(err.errors?.[0]?.message || "Failed to sign up");
        } finally {
            setIsLoading(false);
        }
    };

    // Verification handler
    const onVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status !== "complete") {
                console.error(JSON.stringify(completeSignUp, null, 2));
                toast.error("Verification failed. Please try again.");
            }

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                toast.success("Account created successfully!");
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.errors?.[0]?.message || "Invalid code");
        } finally {
            setIsLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <div className="flex flex-col gap-[30px] items-center text-center">
                <div className="flex flex-col gap-[10px]">
                    <h1 className="text-[30px] font-[500] font-[Satoshi]">Verify your email</h1>
                    <p className="opacity-[0.7] text-sm">We've sent a 6-digit code to {email}</p>
                </div>

                <form onSubmit={onVerify} className="flex flex-col gap-[20px] items-center w-full">
                    <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(value) => setCode(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    <Button loading={isLoading} className="w-full h-[45px]" type="submit">
                        Verify Code
                    </Button>
                    <button
                        type="button"
                        onClick={() => setPendingVerification(false)}
                        className="text-sm underline opacity-[0.6]"
                    >
                        Change email
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center gap-[25px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] flex-3 justify-center">
                <div className="md:h-[100px] flex-1 flex items-center justify-center">
                    <h1 className="text-[30px] font-[500] font-[Satoshi]">Create new account</h1>
                </div>
                <div className="flex flex-col gap-[7px]">
                    <Label>Name</Label>
                    <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Eduardo"
                        required
                        disabled={isLoading}

                    />
                </div>
                <div className="flex flex-col gap-[7px]">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ryangosling@harvard.edu"
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
                <div className="flex flex-col gap-[7px]">
                    <Label>Confirm Password</Label>
                    <div className="flex gap-[8px]">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Sign Up
                </Button>
            </form>
            <div className="flex-2 flex flex-col gap-[25px]">
                <p className="mx-auto text-[12px]">OR</p>
                <OAuthButtons />
                <Link href="/login" className="mx-auto opacity-[0.7]">Already have an account? <span className="underline">Log In</span></Link>
            </div>
        </div >
    )
}

