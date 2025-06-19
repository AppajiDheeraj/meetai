import { AlertCircleIcon } from "lucide-react";

interface Props {
    title: string;
    description: string;
};

export const ErrorState = ({ title, description }: Props) => {
    return (
        <div className="flex items-center justify-center flex-1 py-4 px-8">
            <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                <AlertCircleIcon className="size-6  text-red-500" />
                <div className="flex flex-col gap-y-2 text-center">
                    <h6 className="text-lg font-medium">{title}</h6>
                    <p className="text-sm">{description}</p>
                </div>
            </div>
        </div>
    )
}