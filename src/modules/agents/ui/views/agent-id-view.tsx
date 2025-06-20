"use client";

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import AgentIdViewHeader from '../components/agent-id-view-header';
import React from 'react'
import { GeneratedAvatar } from '@/components/generated-avtar';
import { Badge } from '@/components/ui/badge';
import { VideoIcon } from 'lucide-react';

interface Props {
    agentId: string;
}

export const AgentIdView = ({ agentId } : Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({
        id: agentId
    }))
  return (
    <div className='flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-4'>
        <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onRemove={() => {}}
        />
        <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                <div className="flex items-center gap-x-3">
                    <GeneratedAvatar 
                    seed={data.name}
                    variant="botttsNeutral"
                    className='size-10'
                    />
                    <h2 className='text-2xl font-medium'>{data.name}</h2>
                </div>
                <Badge variant={"outline"} className='flex items-center gap-x-2 [&>svg]:size-4'>
                    <VideoIcon className='text-blue-700' />
                    {data.meetingCount} {data.meetingCount === 1 ? "Meeting" : "Meetings"}
                </Badge>
                <div className="flex flex-col gap-y-4">
                    <p className="text-lg font-medium">Instructions</p>
                    <p className='text-neutral-800'>{data.instructions}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export const AgentIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading Agent"
            description="This may take a few seconds."
        />
    )
}

export const AgentIdViewError = () => {
    return (
        <ErrorState
            title="Error Loading Agent"
            description="Something went wrong."
        />
    )
}