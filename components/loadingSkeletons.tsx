import { Skeleton } from "@/components/ui/skeleton";

export function NextPingSkeleton() {
    return (
        <div className="border bg-muted/60 rounded-[5px] md:h-[50px] h-[45px] w-full flex items-center gap-[10px] relative">
            <div className="absolute top-[-10px] left-[8px] z-[5]">
                <Skeleton className="h-[18px] w-[60px] rounded-[5px]" />
            </div>
            <div className="rounded-tl-[5px] rounded-bl-[5px] h-full w-[80px] bg-background border-r flex items-center justify-center">
                <Skeleton className="h-[15px] w-[40px]" />
            </div>
            <div className="flex-1 px-[10px]">
                <Skeleton className="h-[14px] w-[60%]" />
            </div>
            <div className="p-[3px] h-full">
                <Skeleton className="h-full w-[70px] md:w-[80px] rounded-[4px]" />
            </div>
        </div>
    );
}

export function SidebarSectionSkeleton({ label }: { label: string }) {
    return (
        <div className="">
            <div className="pl-[5px] mb-[10px]">
                <Skeleton className="h-[14px] w-[50px]" />
            </div>
            <div className="rounded-[6px] border border-border/40 w-full bg-muted dark:bg-muted/30 p-[4px] flex flex-col gap-[4px]">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[50px] rounded-[2px] border border-border/20 bg-background/50 flex items-center px-[10px] gap-[10px]">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-[12px] w-[80px]" />
                        <Skeleton className="h-[12px] flex-1" />
                        <Skeleton className="h-[12px] w-[40px]" />
                    </div>
                ))}
                <Skeleton className="w-full h-[34px] rounded-[2px]" />
            </div>
        </div>
    );
}

export function ProjectCardSkeleton() {
    return (
        <div className="rounded-[12px] border border-border/50 bg-card overflow-hidden h-[180px] p-[15px] flex flex-col gap-[15px]">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="mt-auto flex items-center justify-between">
                <Skeleton className="h-8 w-24" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}

export function ProjectsGridSkeleton() {
    return (
        <div className="w-full">
            <div className="pl-[5px] mb-[10px]">
                <Skeleton className="h-[14px] w-[70px]" />
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-[20px]">
                {[1, 2, 3, 4].map((i) => (
                    <ProjectCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
    return (
        <div className="w-full border rounded-[8px] overflow-hidden">
            <div className="bg-muted/50 border-b p-[10px] flex gap-[10px]">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="p-[15px] border-b last:border-0 flex gap-[10px]">
                    {Array.from({ length: cols }).map((_, j) => (
                        <Skeleton key={j} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="w-full h-[350px] border rounded-[10px] bg-muted/20 p-[20px] flex flex-col gap-[20px]">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="flex-1 w-full" />
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="flex flex-col gap-[8px] md:flex-1 bg-muted/40 border border-border/40 rounded-[10px] px-[15px] py-[10px] min-h-[150px] md:h-[180px] relative">
            <Skeleton className="h-5 w-32 mb-auto" />
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                </div>
            ))}
        </div>
    )
}

export function LogsPageSkeleton() {
    return (
        <div className="flex flex-col gap-[20px]">
            <Skeleton className="h-[30px] w-48 mb-4" />
            <TableSkeleton rows={10} cols={4} />
        </div>
    )
}

export function ProjectTitleSkeleton() {
    return (
        <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-1">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-2 w-2 rounded-full" />)}
            </div>
        </div>
    )
}

export function SettingsSkeleton() {
    return (
        <div className="flex flex-col gap-[30px]">
            <div className="rounded-[12px] flex flex-col border overflow-hidden">
                <div className="flex flex-col gap-[10px] p-[20px]">
                    <Skeleton className="h-[14px] w-24 mb-2" />
                    <Skeleton className="h-[40px] w-full" />
                </div>
                <div className="p-[10px] bg-muted flex justify-end">
                    <Skeleton className="h-[40px] w-20" />
                </div>
            </div>

            <div className="flex flex-col gap-[4px] my-[20px]">
                <Skeleton className="h-[24px] w-48 mb-2" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-[20px] w-64" />
                    <Skeleton className="h-[40px] w-[150px]" />
                </div>
            </div>

            <div className="h-[1px] w-full bg-border/20 rounded-[5px]" />

            <div className="flex flex-col gap-[4px] my-[20px]">
                <Skeleton className="h-[24px] w-48 mb-2" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-[20px] w-64" />
                    <Skeleton className="h-[40px] w-[150px]" />
                </div>
            </div>
        </div>
    )
}
