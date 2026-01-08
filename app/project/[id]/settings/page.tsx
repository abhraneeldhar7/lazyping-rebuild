"use client"
import { deleteProject, saveProject } from "@/app/actions/projectActions";
import { useProject } from "@/components/projectContext"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { GithubIcon, PauseIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ProjectSettingsPage() {
    const router = useRouter();
    const { projectData } = useProject();

    if (!projectData) return null;
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);

    return (<div className="flex flex-col gap-[30px]">

        <form className="rounded-[12px] flex flex-col border" onSubmit={async (e) => {
            e.preventDefault();
            if (newName.length < 1) return;
            setLoading(true);
            await saveProject({ ...projectData, projectName: newName })
            setLoading(false);
            toast.success("Updated project name");
            setNewName("")

        }}>
            <div className="flex flex-col gap-[10px] p-[20px]">
                <Label>Project name</Label>
                <Input placeholder={projectData.projectName} value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="p-[10px] bg-muted rounded-b-[12px] flex justify-end">
                <Button disabled={newName.length < 1} loading={loading} type="submit">Save</Button>
            </div>
        </form>


        {/* <div className="flex flex-col gap-[4px] my-[20px] md:my-[50px]">
            <h1 className="text-[19px]">Configure Github</h1>
            <div className="flex gap-[20px] justify-between items-end flex-wrap">
                <p className="opacity-[0.8]">Configure the github repository for this project.</p>
                <Button variant="outline" className="mx-auto md:mx-0 h-[40px] w-[150px]"><GithubIcon /> Configure</Button>
            </div>
        </div> */}
        <div className="flex flex-col gap-[4px] my-[20px] md:my-[50px]">
            <h1 className="text-[19px]">Pause project</h1>
            <div className="flex gap-[20px] justify-between items-end flex-wrap">
                <p className="opacity-[0.8]">Pause pinging and monitoring all the endpoints</p>
                <Button variant="secondary" className="mx-auto md:mx-0 h-[40px] w-[150px]"><PauseIcon fill="var(--foreground)" /> Pause project</Button>
            </div>
        </div>


        <div className="flex flex-col gap-[4px] my-[20px] md:my-[50px]">
            <div className="h-[1px] w-full mb-[20px] md:mb-[50px] bg-foreground/10 rounded-[5px]" />
            <h1 className="text-[19px]">Danger Zone</h1>
            <div className="flex gap-[20px] justify-between items-end flex-wrap">
                <p className="opacity-[0.8]">Delete this project and all of its endpoints</p>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="mx-auto md:mx-0 h-[40px] w-[150px]"><Trash2Icon /> Delete project</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Delete project {projectData.projectName} ?</DialogTitle>
                        <DialogDescription>This will delete the project, all the endpoints and logs</DialogDescription>
                        <DialogFooter>
                            <DialogClose>Cancel</DialogClose>
                            <Button variant="destructive" onClick={() => {
                                deleteProject(projectData.projectId);
                                toast.error("Deleted project")
                                router.push("/dashboard");
                            }}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>




    </div>)
}