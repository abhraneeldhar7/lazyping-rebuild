"use client"
import { PlayIcon, PlusIcon, StickerIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

export default function AddEndpointBtn() {
    const defaultNewEndpoint = {
        route: "",
        intervalMinutes: 30,
        expectedResponse: "",
        method: "GET"
    }
    const [newEndpoint, setNewEndpoint] = useState(defaultNewEndpoint)
    return (
        <div className="flex flex-col gap-[15px] w-full">

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-fit mx-auto"><PlusIcon /> Add Endpoint</Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                    <DialogTitle>Add an endpoint</DialogTitle>
                    <DialogDescription />
                    <div className="flex flex-col gap-[15px]">
                        <div className="flex flex-col gap-[10px]">
                            <Label>Endpoint route</Label>
                            <div className="flex gap-[10px]">
                                <Input value={newEndpoint.route} onChange={(e) => {
                                    setNewEndpoint(prev => {
                                        return { ...prev, route: e.target.value.trim() }
                                    })
                                }} placeholder="your-domain/api/something..." />

                                <Button disabled={newEndpoint.route.length == 0} variant="secondary"><PlayIcon /> Test</Button>

                            </div>
                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <Label>Expected response</Label>
                            <Textarea value={newEndpoint.expectedResponse} onChange={(e) => {
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
                                        return { ...prev, method: e }
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
                    <DialogFooter><DialogClose>Cancel</DialogClose>
                        <Button disabled={newEndpoint.route.length == 0}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>)
}