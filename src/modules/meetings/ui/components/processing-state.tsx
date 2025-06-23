import { EmptyState } from "@/components/empty-state"

export const ProcessingState = () => {
    return (
        <div className="flex flex-col bg-white rounded-lg px-4 py-5 gap-y-8 items-center justify-center">
            <EmptyState
                image="/processing.svg"
                title="Meeting completed"
                description="This meeting was completed, a summary will be available soon."
            />
        </div>
    )
}