"use client"
import { EndpointType } from "@/lib/types";
import Link from "next/link";
import { Button } from "./ui/button";
import { Trash2Icon, Undo2Icon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteEndpoint } from "@/app/actions/endpointActions";

export default function EndpointSettingsClientPage({ endpointDetails }: { endpointDetails: EndpointType }) {
    const router = useRouter();
    return (<>
        <div className="flex flex-col gap-[30px]">
            <Link href={`/project/${endpointDetails.projectId}/e/${endpointDetails.endpointId}`} className="w-fit">
                <Button className="h-[30px] text-[12px]" variant="secondary"><Undo2Icon className="p-[1px]" /> Endpoint</Button>
            </Link>


            <div className="flex flex-col gap-[4px] my-[20px] md:my-[50px]">
                <div className="h-[1px] w-full mb-[20px] md:mb-[50px] bg-foreground/10 rounded-[5px]" />
                <h1 className="text-[19px]">Danger Zone</h1>
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