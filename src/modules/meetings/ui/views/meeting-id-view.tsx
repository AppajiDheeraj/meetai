"use client"

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import MeetingIdViewHeader from "../components/meeting-id-view-header";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/modules/agents/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const [ updateMeetingDialogOpen, setUpdateMeetingDialogOpen ] = useState(false);
    const [ RemoveConfirmation, confirmRemove ] = useConfirm(
        "Are you Sure?",
        "This will remove the meeting and all its data. This action cannot be undone."
    )

    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId,
        })
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                router.push('/meetings');
                toast.success('Meeting removed successfully');
            },
            onError: (error) => {
                toast.error(`Error removing meeting: ${error.message}`);
            }
        })
    )
    
    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if (!ok) return;
        await removeMeeting.mutateAsync({
            id: meetingId,
        });
    }

    const isActive = data.status === 'active';
    const isUpcoming = data.status === 'upcoming';
    const isCompleted = data.status === 'completed';
    const isCancelled = data.status === 'cancelled';
    const isProcessing = data.status === 'processing';

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader 
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                    onRemove={handleRemoveMeeting}
                />
                {isCancelled && (
                    <CancelledState />
                )}
                {isCompleted && (<div>Completed</div>)}
                {isUpcoming && (
                    <UpcomingState
                        meetingId={meetingId}
                        onCancelMeeting={() => {}}
                        isCancelling={false}
                    />
                )}
                {isActive && (
                    <ActiveState
                        meetingId={meetingId}
                    />
                )}
                {isProcessing && (
                    <ProcessingState />
                )}
            </div>
        </>
    )
}

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meeting"
            description="This may take a few seconds."
        />
    )
}

export const MeetingIdViewError = () => {
    return (
        <ErrorState
            title="Error Loading Meeting"
            description="Something went wrong."
        />
    )
}