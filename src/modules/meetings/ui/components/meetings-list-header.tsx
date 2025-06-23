"use client"

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { DEFAULT_PAGE } from "@/constants";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingsListHeader = () => {
    const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);
    const [filters, setFilters] = useMeetingsFilters();

    const isAnyFilterActive = !!filters.search ||
        !!filters.status || !!filters.agentId;

    const onClearFilters = () => {
        setFilters({
            search: '',
            status: null,
            agentId: "",
            page: DEFAULT_PAGE,
        });
    }
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
                <ScrollArea>
                    <div className="flex items-center gap-x-2 p-1">
                        <MeetingsSearchFilter />
                        <StatusFilter />
                        <AgentIdFilter />
                        {isAnyFilterActive && (
                            <Button variant="outline" onClick={onClearFilters}>
                                <XCircleIcon className="size-4" />
                                <span>Clear</span>
                            </Button>
                        )}
                    </div>
                <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </>
    );
}