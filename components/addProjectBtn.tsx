import { GithubIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RepoCombobox } from "./repoCombobox";


export default function NewProjectBtn() {

    return (
        <div >
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="shinny">
                        New Project
                    </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                    <DialogTitle>
                        Add new project
                    </DialogTitle>
                    <DialogDescription />
                    <div className="flex flex-col gap-[15px]">
                        <div className="flex flex-col gap-[8px]">
                            <Label>Name</Label>
                            <Input placeholder="Very cool project" />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <Button>
                                Connect Github <GithubIcon />
                            </Button>
                            <RepoCombobox />
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose>Cancel</DialogClose>
                        <Button variant="shinny">Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}