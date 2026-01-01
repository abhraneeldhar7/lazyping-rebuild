import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-[white] h-[100vh] p-[15px] md:p-[40px] flex md:gap-[40px] relative md:flex-row flex-col-reverse">
            <Image src="/login_pic.jpg" height={400} width={400} alt="" unoptimized className="z-[1] absolute top-0 left-0 h-full w-full object-cover blur-[15px] opacity-[0.05]" />

            <div className="flex-1 flex justify-center items-center z-[2]">
                {children}
            </div>

            <div className="flex-1 md:flex hidden justify-center text-[black] items-center z-[1] flex-col gap-[16px]">
                <Image src="/login_pic.jpg" height={400} width={400} alt="" unoptimized
                    className="shadow-md w-full h-fit object-contain max-w-[400px] w-full" />
                <p className="text-[14px] opacity-[0.6]">Never let your servers sleep</p>
            </div>
        </div>
    );
}
