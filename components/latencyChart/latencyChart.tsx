"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { PingLog } from "@/lib/types"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "An interactive latency chart"

const chartConfig = {
    latency: {
        label: "Latency",
        color: "var(--chart-1)",
    }
} satisfies ChartConfig

export function ChartAreaInteractive({ logs }: { logs: PingLog[] }) {
    const [timeRange, setTimeRange] = React.useState("1h")

    const processedData = React.useMemo(() => {
        const now = new Date();
        const data = [];

        if (timeRange === "1h") {
            // Last hour, 5-minute buckets
            for (let i = 11; i >= 0; i--) {
                const end = new Date(now.getTime() - i * 300000); // 5 min
                const start = new Date(end.getTime() - 300000);

                const logsInBucket = logs.filter(l => {
                    const t = new Date(l.timestamp).getTime();
                    return t >= start.getTime() && t < end.getTime();
                });

                const avgLatency = logsInBucket.length > 0
                    ? Math.round(logsInBucket.reduce((acc, l) => acc + (l.latencyMs || 0), 0) / logsInBucket.length)
                    : 0;

                data.push({
                    time: end.toISOString(),
                    latency: avgLatency,
                    label: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }
        } else if (timeRange === "24h") {
            // Last 24 hours, hourly buckets
            for (let i = 23; i >= 0; i--) {
                const end = new Date(now.getTime() - i * 3600000);
                const start = new Date(end.getTime() - 3600000);
                const logsInBucket = logs.filter(l => {
                    const t = new Date(l.timestamp).getTime();
                    return t >= start.getTime() && t < end.getTime();
                });

                const avgLatency = logsInBucket.length > 0
                    ? Math.round(logsInBucket.reduce((acc, l) => acc + (l.latencyMs || 0), 0) / logsInBucket.length)
                    : 0;

                data.push({
                    time: end.toISOString(),
                    latency: avgLatency,
                    label: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }
        } else if (timeRange === "7d") {
            // Last 7 days, daily buckets
            for (let i = 6; i >= 0; i--) {
                const day = new Date(now.getTime() - i * 86400000);
                const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
                const end = new Date(start.getTime() + 86400000);

                const logsInBucket = logs.filter(l => {
                    const t = new Date(l.timestamp).getTime();
                    return t >= start.getTime() && t < end.getTime();
                });

                const avgLatency = logsInBucket.length > 0
                    ? Math.round(logsInBucket.reduce((acc, l) => acc + (l.latencyMs || 0), 0) / logsInBucket.length)
                    : 0;

                data.push({
                    time: start.toISOString(),
                    latency: avgLatency,
                    label: start.toLocaleDateString([], { weekday: 'short' })
                });
            }
        } else {
            // Last 30 days, daily buckets
            for (let i = 29; i >= 0; i--) {
                const day = new Date(now.getTime() - i * 86400000);
                const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
                const end = new Date(start.getTime() + 86400000);

                const logsInBucket = logs.filter(l => {
                    const t = new Date(l.timestamp).getTime();
                    return t >= start.getTime() && t < end.getTime();
                });

                const avgLatency = logsInBucket.length > 0
                    ? Math.round(logsInBucket.reduce((acc, l) => acc + (l.latencyMs || 0), 0) / logsInBucket.length)
                    : 0;

                data.push({
                    time: start.toISOString(),
                    latency: avgLatency,
                    label: start.toLocaleDateString([], { month: 'short', day: 'numeric' })
                });
            }
        }
        return data;
    }, [logs, timeRange]);

    return (
        <div className="flex flex-col gap-[40px]">
            <div className="flex items-start gap-[15px] justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Latency</h2>
                    <p className="text-sm text-muted-foreground">Response time in milliseconds</p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 24 hours" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="1h" className="rounded-lg">
                            Last hour
                        </SelectItem>
                        <SelectItem value="24h" className="rounded-lg">
                            Last 24 hours
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative w-full" >
                <div className="h-[250px] absolute z-[4] top-0 left-[-2px] w-[25px] bg-gradient-to-r from-background from-[10%] to-transparent to-[90%]" />
                <div className="h-[250px] absolute z-[4] top-0 right-[-2px] w-[25px] bg-gradient-to-l from-background from-[10%] to-transparent to-[90%]" />

                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={processedData} margin={{ left: -20, right: -20 }}>
                        <defs>
                            <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-latency)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-latency)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value, p) => {
                                        return p[0]?.payload?.label || value;
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="latency"
                            type="monotone"
                            fill="url(#fillLatency)"
                            stroke="var(--color-latency)"
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    )
}

