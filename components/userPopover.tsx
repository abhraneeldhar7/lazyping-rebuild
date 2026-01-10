"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth, useUser } from "@clerk/nextjs"
import Image from "next/image";
import { CommandIcon, LayoutGrid, LogOutIcon, UserRound } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { PopoverClose } from "@radix-ui/react-popover";

export function UserPopoverComponent() {
    const { user } = useUser();
    const { signOut } = useAuth();
    if (!user) return null;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Image unoptimized alt="" src={user.imageUrl} height={30} width={30} className="object-cover rounded-[50%] h-[30px] h-[30px]" />

            </PopoverTrigger>
            <PopoverContent autoFocus={false} className="flex flex-col gap-[4px] p-[4px] w-[160px]">
                {/* <Link href="/profile">
                    <PopoverClose className="w-full flex justify-start gap-[7px] text-[14px] items-center px-[10px] py-[5px] hover:bg-muted rounded-[4px]">
                        <UserRound size={14} />
                        Profile
                    </PopoverClose>
                </Link> */}
                <Link href="/dashboard">
                    <PopoverClose className="w-full flex justify-start gap-[7px] text-[14px] items-center px-[10px] py-[5px] hover:bg-muted rounded-[4px]">
                        <LayoutGrid size={14} />
                        Dashboard
                    </PopoverClose>
                </Link>
                <PopoverClose className="text-[red] w-full flex justify-start gap-[7px] text-[14px] items-center px-[10px] py-[5px] hover:bg-muted rounded-[4px]" onClick={() => signOut({ redirectUrl: "/login" })}>
                    <LogOutIcon size={14} />
                    Log out
                </PopoverClose>

            </PopoverContent>
        </Popover>

    )
}
