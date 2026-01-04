"use client"

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation"

function capitalize(str: string) {
    return (str[0].toUpperCase() + str.slice(1, str.length).toLowerCase())
}
export default function ProjectTitle({ projectName }: { projectName: string }) {
    const pathList = usePathname().split("/").slice(1, 3);
    // const pathname = pathList.split("/")[pathList.split("/").length - 1]

    return (
        <div className="flex gap-[10px]">
            {pathList.map((path, index) => (
                <div className="flex gap-[10px] items-center leading-[1em]" key={index}>
                    {index > 0 &&
                        <ChevronRight size={14} className="opacity-[0.3]" />
                    }
                    {index == 1 ?
                        <p className={`text-[15px] ${pathList.length > 2 && "opacity-[0.7]"}`} >{projectName}</p>
                        :
                        <p className={`text-[15px] ${index == 0 && pathList.length > 1 && "opacity-[0.7]"}`} >{capitalize(path)}</p>
                    }
                </div>
            ))}
        </div>
    )
}