import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AgentIdView, AgentIdViewLoading, AgentIdViewError } from "@/modules/agents/ui/views/agent-id-view";

interface Props {
    params: Promise<{ agentId: string }>
}

const Page = async (
    { params }: Props
) => {
    const {agentId} = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({
            id: agentId
        })
    )
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentIdViewLoading />}>
                <ErrorBoundary fallback={<AgentIdViewError />}>
                    <AgentIdView agentId={agentId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page