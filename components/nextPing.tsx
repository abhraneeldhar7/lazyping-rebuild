import { ChevronRight } from "lucide-react";

export default function NextPingComponent() {
    return (
        <div className="border bg-muted/60 rounded-[5px] md:h-[50px] h-[45px] w-full flex  items-center gap-[10px] relative">
            <div className="text-[var(--success)] text-[11px] bg-background absolute top-[-10px] py-[4px] leading-[1em] px-[7px] left-[8px] border rounded-[5px]">
                Next ping
            </div>

            <div className="border border-foreground/30 rounded-[5px] absolute bottom-[-1px] left-[30px] right-[30px]" />

            <div className="rounded-tl-[5px] rounded-bl-[5px] h-full w-[80px] flex items-center justify-center bg-background border-r">
                <p className="text-[15px] leading-[1em]">GET</p>
            </div>

            <div className="flex items-center flex-1 md:gap-[15px] gap-[6px] p-[6px] pl-[10px]">

                <div className="relative flex-1 h-[1.2em]">
                    <p className="text-[12px] opacity-[0.6] truncate absolute left-0 right-0">/api/websoohkss/ss/sclerk/mencne/ce/e/asidhshda/r</p>
                </div>
                {/* <p className="text-[14px] opacity-[0.7]">No scheduled pings</p> */}
            </div>


            <div className="flex items-center justify-center text-[var(--success)] bg-secondary shadow-md w-[70px] md:w-[80px] rounded-[4px] h-full text-[14px] select-none">
                <p>00:50s</p>
            </div>
        </div>
    )
}