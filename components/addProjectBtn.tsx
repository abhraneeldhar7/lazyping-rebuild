"use client"
import { LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { createProject } from "@/app/actions/projectActions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getTierLimits } from "@/lib/pricingTiers";


export default function NewProjectBtn({ projectCount }: { projectCount: number }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [projectName, setProjectName] = useState<string>("")
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const user = useUser();
    const userMetadata = (user as any)?.publicMetadata;
    const allowNewProject = projectCount < getTierLimits(userMetadata?.subscriptionTier || "Free")?.max_projects;

    if (allowNewProject) {
        return (
            <Dialog open={openDialog} onOpenChange={(e) => { setOpenDialog(e); setProjectName("") }}>
                <DialogTrigger asChild>
                    <Button variant="shinny">
                        New Project
                    </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} >

                    <DialogTitle>
                        Add new project
                    </DialogTitle>
                    <DialogDescription />
                    <form className="flex flex-col gap-[30px]" onSubmit={async (e) => {
                        e.preventDefault();
                        if (projectName.length < 3) {
                            toast.warning("Name should be more than 3 charecters");
                            return;
                        };
                        try {
                            setLoading(true);
                            const res = await createProject({ projectName: projectName, githubIntegration: null });
                            if (res.success) {
                                toast.success("Project created successfully");
                                router.push(`/project/${res.project.projectId}`)
                            } else {
                                toast.error(res.error);
                                setOpenDialog(false);
                                return;
                            }
                        }
                        catch (error) {
                            toast.error("Failed to create project");
                            setLoading(false);
                            return;
                        }

                    }}>
                        <div className="flex flex-col gap-[15px] h-[60px]">
                            <div className="flex flex-col gap-[8px]">
                                <Label>Name</Label>
                                <Input placeholder="Very cool project" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                            </div>
                            {/* <div className="flex flex-col gap-[8px]">
                            <Button>
                                Connect Github <GithubIcon />
                            </Button>
                            <RepoCombobox />
                        </div> */}

                        </div>

                        <DialogFooter>
                            {!loading ?
                                <>
                                    <DialogClose>Cancel</DialogClose>
                                    <Button disabled={projectName.length < 3} variant="shinny" type="submit">Create</Button>
                                </>
                                :
                                <div className="h-[36px] w-[35px] ml-auto flex items-center justify-center">
                                    <LoaderCircle size={18} className="animate-spin" />
                                </div>
                            }
                        </DialogFooter>

                    </form>
                </DialogContent>
            </Dialog>
        )
    }
    else {
        return <></>
    }
}