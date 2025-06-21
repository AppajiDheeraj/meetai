"use client"

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { DEFAULT_PAGE } from "@/constants";
import { NewMeetingDialog } from "./new-meeting-dialog";

export const MeetingsListHeader = () => {
    const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);
       return (
        <>
            <NewMeetingDialog open={newMeetingDialogOpen} onOpenChange={setNewMeetingDialogOpen} />
            <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Meetings</h5>
                    <Button className="flex items-center"
                    onClick={() => {
                        setNewMeetingDialogOpen(true);
                    }}>
                        <PlusIcon />
                        New Meeting
                    </Button>
                </div>
                <div className="flex items-center gap-x-2 p-1">
                </div>
            </div>
        </>
    );
}