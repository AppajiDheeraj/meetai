"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";

export const AgentsView = () => {
    const trpc = useTRPC();
    const [ filters, setFilters ] = useAgentsFilters();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-4">
            <DataTable data={data.items} columns={columns} />
            <DataPagination
            page = {filters.page}
            totalPages = {data.totalPages}
            onPageChange = {(page: number) => { setFilters({ page }) }}
            />
            {(data.items.length === 0) &&
                <EmptyState
                    title="Create your first agent"
                    description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants in the call"
                />
            }
        </div>
    )
}

export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Agents"
            description="This may take a few seconds."
        />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Error Loading Agents"
            description="Something went wrong."
        />
    )
}