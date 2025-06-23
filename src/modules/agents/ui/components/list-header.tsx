"use client"

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";

export const ListHeader = () => {
    const [ filters, setFilters ] = useAgentsFilters();
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);

    const isAnyFilterModified = !!filters.search;

    const onClearFilters = () => {
        setFilters({
            search: '',
            page: DEFAULT_PAGE
        })
    }

    return (
        <>
            <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Agents</h5>
                    <Button className="flex items-center" onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon />
                        New Agent
                    </Button>
                </div>
                <ScrollArea>
                <div className="flex items-center gap-x-2 p-1">
                    <AgentsSearchFilter />
                    {
                        isAnyFilterModified && (
                            <Button variant="outline" size="sm" onClick={onClearFilters}>
                                <XCircleIcon />
                                Clear Filters
                            </Button>
                        )
                    }
                </div>
                <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </>
    );
}