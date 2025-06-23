import { EmptyState } from "@/components/empty-state"

export const CancelledState = () => {
    return (
        <div className="flex flex-col bg-white rounded-lg px-4 py-5 gap-y-8 items-center justify-center">
            <EmptyState
                image="/cancelled.svg"
                title="Meeting cancelled"
                description="This meeting was cancelled."
            />
        </div>
    )
}