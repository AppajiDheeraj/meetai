import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { BanIcon, VideoIcon } from "lucide-react"
import Link from "next/link"

interface Props {
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;    
}

export const UpcomingState = ({
    meetingId,
    onCancelMeeting,
    isCancelling,
}: Props) => {
    return (
        <div className="flex flex-col bg-white rounded-lg px-4 py-5 gap-y-8 items-center justify-center">
            <EmptyState
                image="/upcoming.svg"
                title="Not started yet"
                description="Once you start this meeting, a summary will be generated here."
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button
                variant={"secondary"}
                className="w-full lg:w-auto"
                onClick={onCancelMeeting}
                disabled={isCancelling}
                >
                    <BanIcon />
                    Cancel Meeting
                </Button>
                <Button asChild 
                className="w-full lg:w-auto"
                disabled={isCancelling}                
                >
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon />
                        Start Meeting
                    </Link>
                </Button>
            </div>
        </div>
    )
}