import { LoaderCircle } from "lucide-react";

export default function SigninFall() {
    return (<div className="max-w-[400px] rounded-[10px] bg-[#fffffa] h-[500px] w-full border-[2px] border-primary/25 flex items-center justify-center">
        <LoaderCircle className="opacity-[0.6] text-[black] animate-spin"/>
    </div>)
}