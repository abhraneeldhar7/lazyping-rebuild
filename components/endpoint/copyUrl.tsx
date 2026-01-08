"use client"
import { copyToClipboard } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export default function CopyUrl({ url }: { url: string }) {
    return (
        <CopyIcon size={17} onClick={() => {
            copyToClipboard(url)

        }} />
    )
}