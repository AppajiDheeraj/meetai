import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avtar";

export const AgentIdFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();

    const trpc = useTRPC();

    const [ agentSearch, setAgentSearch ] = useState('');
    const { data } = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    );

    return (
        <CommandSelect
        className="h-9"
        placeholder="Agent"
        value={filters.agentId ?? ''}
        options={(data?.items ?? []).map((agent)=> (
            {
                id: agent.id,
                value: agent.id,
                children: (
                    <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                        seed={agent.name}
                        variant="botttsNeutral"
                        className="size-4"
                        />
                        <span className="capitalize">{agent.name}</span>
                    </div>
                ),
            }
        ))}
        onSelect={(value) => {
            setFilters({ agentId: value });
        }}
        onSearch={setAgentSearch}
        />
    )

}