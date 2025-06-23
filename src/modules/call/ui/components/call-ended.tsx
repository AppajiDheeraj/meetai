import { Button } from "@/components/ui/button";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import Link from "next/link";


export const CallEnded = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="font-medium text-lg">You have ended the call</h6>
                        <p className="text-sm">A summary will appear in a few minutes</p>
                    </div>
                    <Button asChild>
                        <Link href="/meetings" className="w-full">
                            Back to meetings
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};