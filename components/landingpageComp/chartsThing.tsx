"use client"
import { Area, AreaChart, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { TextAnimate } from "../ui/text-animate";

export default function ChartsThing() {

    const chartConfig = {
        latency: {
            label: "Latency",
            color: "var(--chart-1)",
        }
    } satisfies ChartConfig

    const processedData = [
        { label: "00:00", latency: 120 },
        { label: "01:00", latency: 150 },
        { label: "02:00", latency: 100 },
        { label: "03:00", latency: 180 },
        { label: "04:00", latency: 220 },
        { label: "05:00", latency: 160 },
        { label: "06:00", latency: 140 },
        { label: "07:00", latency: 190 },
        { label: "08:00", latency: 250 },
        { label: "09:00", latency: 310 },
        { label: "10:00", latency: 280 },
        { label: "11:00", latency: 240 },
        { label: "12:00", latency: 260 },
        { label: "13:00", latency: 340 },
        { label: "14:00", latency: 380 },
        { label: "15:00", latency: 320 },
        { label: "16:00", latency: 300 },
        { label: "17:00", latency: 420 },
        { label: "18:00", latency: 480 },
        { label: "19:00", latency: 450 },
        { label: "20:00", latency: 390 },
        { label: "21:00", latency: 360 },
        { label: "22:00", latency: 380 },
        { label: "23:00", latency: 350 },
    ]

    return (
        <div className="flex flex-col relative">
            <h1 className="text-[28px] font-[400] text-center opacity-[0.6] px-[14px]">
                Less text
            </h1>

            <div className="relative w-full overflow-hidden" >

                <TextAnimate delay={0.2} animation="slideUp" className="text-[40px] font-[500] absolute top-0 z-[-1] left-[50%] translate-x-[-50%] select-none cursor-pointer" as="h1">
                    More Data
                </TextAnimate>

                <div className="h-[250px] absolute z-[4] top-0 left-[-2px] w-[35px] bg-gradient-to-r from-background from-[20%] to-transparent to-[100%]" />
                <div className="h-[250px] absolute z-[4] top-0 right-[-2px] w-[35px] bg-gradient-to-l from-background from-[20%] to-transparent to-[100%]" />

                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[150px] w-full"
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
                        {/* <CartesianGrid vertical={false} /> */}
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