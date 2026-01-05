"use client"
import { CopyIcon, LoaderCircle, PlayIcon, PlusIcon, StickerIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { EndpointType, methodType } from "@/lib/types";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { copyToClipboard } from "@/lib/utils";
import { createEndpoint } from "@/app/actions/endpointActions";
import { useRouter } from "next/navigation";

export default function AddEndpointBtn({ projectId }: { projectId: string }) {
    const router = useRouter();
    const defaultNewEndpoint = {
        url: "",
        method: "GET" as methodType,
        expectedResponse: "",
        headers: null,
        body: "",
        projectId: projectId,
        intervalMinutes: 10,
    }
    const [newEndpoint, setNewEndpoint] = useState(defaultNewEndpoint)

    const [loading, setLoading] = useState(false);
    const [loadingTest, setLoadingTest] = useState(false);
    const handleCreate = async () => {
        if (newEndpoint.url.length < 1) return;
        setLoading(true);
        try {
            const res = await createEndpoint(newEndpoint);
            toast.success("Endpoint created successfully");
            // setOpenDialog(false);
            router.push(`/project/${projectId}/e/${res}`)
        } catch (e) {
            toast.error("Failed to create endpoint");
            setLoading(false);
        }

    }

    const [openDialog, setOpenDialog] = useState(false);
    const [testResponse, setTestResponse] = useState<string | null>(null);

    const testPing = async () => {
        if (newEndpoint.url.length < 1) return;
        setTestResponse("");
        setLoadingTest(true);
        try {
            const response = await fetch(newEndpoint.url, {
                method: newEndpoint.method,
                // headers: newEndpoint.headers,
                // body: newEndpoint.body
            })
            if (!response.ok) {
                toast.error("Network response was not ok")
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTestResponse(JSON.stringify(data, null, 2));

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingTest(false);
        }
    }

    return (
        <div className="flex flex-col gap-[15px] w-full">

            <Dialog open={openDialog} onOpenChange={(e) => {
                setNewEndpoint(defaultNewEndpoint);
                setOpenDialog(e)
            }}>
                <DialogTrigger asChild>
                    <Button className="w-fit mx-auto" variant="shinny"><PlusIcon /> Add Endpoint</Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                    <DialogTitle>Add an endpoint</DialogTitle>
                    <DialogDescription className="hidden" />

                    {!testResponse &&
                        <div className="rounded-[12px] text-[15px] bg-blue-600/20 border px-[20px] py-[15px] ">
                            <p>Adding headers and environment secrets for endpoints is in development</p>
                        </div>
                    }

                    <div className="flex flex-col gap-[20px] mt-[10px]">
                        <div className="flex flex-col gap-[10px]">
                            <Label>Endpoint route</Label>
                            <div className="flex gap-[10px]">
                                <Input value={newEndpoint.url} onChange={(e) => {
                                    setNewEndpoint(prev => {
                                        return { ...prev, url: e.target.value.trim() }
                                    })
                                }} placeholder="your-domain/api/something..." />

                                <Button loading={loadingTest} disabled={newEndpoint.url.length == 0} variant="secondary" onClick={() => { testPing(); }}><PlayIcon /> Test</Button>

                            </div>

                            {testResponse &&
                                <div className="flex flex-col gap-[10px] mt-[10px]">
                                    <div className="flex justify-between pr-[5px]">
                                        <Label>Response</Label>
                                        <CopyIcon size={17} onClick={() => { copyToClipboard(testResponse) }} />
                                    </div>
                                    <ScrollArea className="h-[150px] box-border  bg-muted px-[15px] py-[10px] text-[14px] opacity-[0.9] rounded-[4px] border">
                                        <pre className="text-wrap break-all">
                                            {testResponse}
                                        </pre>
                                    </ScrollArea>
                                    <div className="flex justify-end">
                                        <Button variant="ghost" className="text-[11px] h-[32px]" onClick={() => { setTestResponse(null) }}><XIcon /> Clear</Button>
                                    </div>
                                </div>
                            }

                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <Label>Expected response</Label>
                            <Textarea className="max-h-[200px]" value={newEndpoint.expectedResponse} onChange={(e) => {
                                setNewEndpoint(prev => {
                                    return { ...prev, expectedResponse: e.target.value.trim() }
                                })
                            }} placeholder="{ status : `healthy` } or keep it empty" />
                        </div>

                        <div className="flex gap-[15px] justify-between md:flex-row flex-col">
                            <div className="flex flex-col gap-[10px]">
                                <Label>Ping interval</Label>
                                <Select value={String(newEndpoint.intervalMinutes)} onValueChange={(e) => {
                                    setNewEndpoint(prev => {
                                        return { ...prev, intervalMinutes: Number(e) }
                                    })
                                }}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select interval" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Ping every</SelectLabel>
                                            <SelectItem value={"5"}>5 minutes</SelectItem>
                                            <SelectItem value={"10"}>10 minutes</SelectItem>
                                            <SelectItem value={"30"}>30 minutes</SelectItem>
                                            <SelectItem value={"60"}>1 hour</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-[10px]">
                                <Label>Method</Label>
                                <Select value={String(newEndpoint.method)} onValueChange={(e) => {
                                    setNewEndpoint(prev => {
                                        return { ...prev, method: e as methodType }
                                    })
                                }}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Method</SelectLabel>
                                            <SelectItem value={"GET"}>GET</SelectItem>
                                            <SelectItem value={"PUT"}>PUT</SelectItem>
                                            <SelectItem value={"POST"}>POST</SelectItem>
                                            <SelectItem value={"DELETE"}>DELETE</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>


                    </div>
                    <DialogFooter className="mt-[10px]">
                        {!loading ? <>
                            <DialogClose>Cancel</DialogClose>
                            <Button variant="shinny" disabled={newEndpoint.url.length == 0} onClick={() => {
                                handleCreate();
                            }}>Confirm</Button>
                        </> :
                            <div className="h-[36px] w-[35px] ml-auto flex items-center justify-center">
                                <LoaderCircle size={18} className="animate-spin" />
                            </div>}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>)
}