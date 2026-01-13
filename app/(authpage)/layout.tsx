import OAuthButtons from "@/components/auth/OAuthButtons";
import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex gap-[20px] md:p-[20px] p-[15px] max-w-[1500px] w-full mx-auto relative md:h-[100vh] h-[100svh]">
            <div className="flex-1 md:static absolute z-[-1] overflow-hidden rounded-[14px] left-0 top-0 h-full">
                <Image className="dark:hidden h-full object-cover w-full md:opacity-[1] opacity-[0.24]" preload unoptimized alt="" src="/login/light.jpg" width={600} height={600} />
                <Image className="hidden dark:block h-full object-cover w-full" preload unoptimized alt="" src="/login/dark.jpg" width={600} height={600} />
            </div>
            <div className="flex-1 flex flex-col items-center">
                <div className="max-w-[350px] w-full flex flex-col gap-[20px] justify-center flex-1">
                    {children}
                    <div className="flex-2 flex flex-col gap-[20px]">
                        <p className="mx-auto text-[12px] opacity-[0.6]">OR</p>
                        <OAuthButtons />
                    </div>
                </div>
            </div>
        </div>
    );
}
