import { CommandDialog, CommandInput } from "@/components/ui/command";
import { CommandItem, CommandList } from "cmdk";
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
};

export const DashboardCommand = ({ open, setOpen }: Props) => {
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
            placeholder="Find a meeting or agent"
            />
            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandDialog>
    );
};