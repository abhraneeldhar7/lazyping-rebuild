"use client"
import { EndpointType, methodType } from "@/lib/types";
import Link from "next/link";
import { Button } from "./ui/button";
import { CopyIcon, PlayIcon, SaveIcon, Trash2Icon, Undo2Icon, XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteEndpoint, updateEndpoint } from "@/app/actions/endpointActions";
import { Label } from "./ui/label";
import { useState } from "react";
import { Input } from "./ui/input";
import { compareObjects, copyToClipboard } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";

export default function EndpointSettingsClientPage({ endpointDetails }: { endpointDetails: EndpointType }) {
    const router = useRouter();
    const [endpointDetailsUpdated, setEndpointDetailsUpdated] = useState(endpointDetails)
    const [testResponse, setTestResponse] = useState<string | null>(null)
    const [loadingTest, setLoadingTest] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);

    const handleSave = async () => {
        if (compareObjects(endpointDetails, endpointDetailsUpdated)) return;
        setSaveLoader(true);
        try {
            await updateEndpoint(endpointDetailsUpdated);
            toast.success("Endpoint updated successfully");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update endpoint");
        } finally {
            setSaveLoader(false);
            endpointDetails = endpointDetailsUpdated
        }
    }

    const testPing = async () => {
        if (endpointDetailsUpdated.url.length < 1) return;
        setTestResponse("");
        setLoadingTest(true);
        try {
            const response = await fetch(endpointDetailsUpdated.url, {
                method: endpointDetailsUpdated.method,
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
            console.error(error);
        } finally {
            setLoadingTest(false);
        }
    }



    return (<>
        <div className="flex flex-col gap-[30px]">
            <div className="flex gap-[30px] justify-end items-center">


                <Button loading={saveLoader} onClick={handleSave} disabled={compareObjects(endpointDetails, endpointDetailsUpdated)}><SaveIcon /> Save</Button>
            </div>


            <div className="flex flex-col gap-[30px]">

                <div className="flex flex flex-col gap-[5px]">
                    <Label>Endpoint Name</Label>
                    <Input placeholder={endpointDetails.endpointName} defaultValue={endpointDetails.endpointName} onChange={(e) => {

                        setEndpointDetailsUpdated({ ...endpointDetailsUpdated, endpointName: e.target.value })

                    }} className="md:w-[300px] w-full" />
                </div>

                <div className="flex flex flex-col gap-[5px]">
                    <Label>Endpoint URL</Label>
                    <div className="flex gap-[10px]">
                        <Input placeholder={endpointDetails.url} defaultValue={endpointDetails.url} onChange={(e) => {
                            if (e.target.value.length == 0) {
                                setEndpointDetailsUpdated({ ...endpointDetailsUpdated, url: endpointDetails.url })
                            }
                            else {
                                setEndpointDetailsUpdated({ ...endpointDetailsUpdated, url: e.target.value })
                            }
                        }} />
                        <Button loading={loadingTest} disabled={endpointDetailsUpdated.url.length == 0} variant="secondary" onClick={() => { testPing(); }} className="w-[85px]"><PlayIcon /> Test</Button>
                    </div>
                </div>



                <div className="gap-[20px] grid md:grid-cols-2 grid-cols-1">
                    <div className="flex flex-col gap-[10px] flex-1">
                        <div className="h-[23px] flex items-start">
                            <Label>Expected response</Label>
                        </div>
                        <Textarea className="min-h-[150px] max-h-[200px] h-full" placeholder={endpointDetails.expectedResponse || "{ status : `healthy` } or keep it empty"} defaultValue={endpointDetails.expectedResponse || ""} onChange={(e) => {
                            if (e.target.value.length == 0) {
                                setEndpointDetailsUpdated({ ...endpointDetailsUpdated, expectedResponse: endpointDetails.expectedResponse })
                            }
                            else {
                                setEndpointDetailsUpdated({ ...endpointDetailsUpdated, expectedResponse: e.target.value })
                            }
                        }} />
                        {testResponse &&
                            <div className="md:h-[44px]"></div>
                        }
                    </div>


                    {testResponse &&
                        <div className={`flex flex-col gap-[10px] flex-1 transition-all duration-300 overflow-hidden`}>
                            <div className="flex justify-between pr-[5px] items-start">
                                <Label>Response received</Label>
                                <CopyIcon size={17} onClick={() => { copyToClipboard(testResponse) }} />
                            </div>
                            <ScrollArea className="md:h-[200px] h-[150px] box-border  bg-muted px-[15px] py-[10px] text-[14px] opacity-[0.9] rounded-[4px] border">
                                <pre className="text-wrap break-all">
                                    {testResponse}
                                </pre>
                            </ScrollArea>
                            <div className="flex justify-end">
                                <Button variant="ghost" className="text-[11px] h-[32px]" onClick={() => { setTestResponse(null) }}><XIcon /> Clear</Button>
                            </div>
                        </div>
                    }

                    <div className="flex gap-[25px] flex-1 md:flex-row flex-col">
                        <div className="flex flex-col gap-[10px] flex-1">
                            <Label>Ping interval</Label>
                            <Select value={String(endpointDetailsUpdated.intervalMinutes)} onValueChange={(e) => {
                                setEndpointDetailsUpdated({ ...endpointDetailsUpdated, intervalMinutes: Number(e) })
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Ping every</SelectLabel>
                                        <SelectItem value={"1"}>1 minute</SelectItem>
                                        <SelectItem value={"5"}>5 minutes</SelectItem>
                                        <SelectItem value={"10"}>10 minutes</SelectItem>
                                        <SelectItem value={"15"}>15 minutes</SelectItem>
                                        <SelectItem value={"30"}>30 minutes</SelectItem>
                                        <SelectItem value={"60"}>1 hour</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-[10px] flex-1">
                            <Label>Method</Label>
                            <Select value={endpointDetailsUpdated.method} onValueChange={(e) => {
                                setEndpointDetailsUpdated({ ...endpointDetailsUpdated, method: e as methodType })
                            }}>
                                <SelectTrigger className="w-full">
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

            </div>



            <div className="flex flex-col gap-[4px] my-[20px] md:my-[50px]">
                <div className="h-[1px] w-full mb-[20px] md:mb-[50px] bg-foreground/10 rounded-[5px]" />
                <h1 className="text-[19px]">Delete</h1>
                <div className="flex gap-[20px] justify-between items-end flex-wrap">
                    <p className="opacity-[0.8]">Delete this endpoint and all the logs</p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="mx-auto md:mx-0 h-[40px] w-[150px]"><Trash2Icon /> Delete endpoint</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Delete endpoint {endpointDetails.url} ?</DialogTitle>
                            <DialogDescription>This will delete the endpoint and all the logs</DialogDescription>
                            <DialogFooter>
                                <DialogClose>Cancel</DialogClose>
                                <Button variant="destructive" onClick={() => {
                                    deleteEndpoint(endpointDetails.endpointId)
                                    toast.error("Deleted endpoint")
                                    router.push(`/project/${endpointDetails.projectId}`);
                                }}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>

    </>)
}