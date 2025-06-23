import { LogInIcon } from "lucide-react";
import {
  DefaultVideoPlaceholder,
  name,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";

import '@stream-io/video-react-sdk/dist/css/styles.css';
import Link from "next/link";

interface Props {
    onJoin: () => void;
};

const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();

    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    name: data?.user.name ?? "",
                    image: data?.user.image ?? generateAvatarUri({
                        seed: data?.user.name ?? "",
                        variant: "initials",
                    }),
                } as StreamVideoParticipant
            }
        />
    )
}

const AllowBrowserPermissions = () => {
    return (
        <p className="text-sm">
            Please allow access to your camera and microphone in your browser settings to join the call.
        </p>
    );
};

export const CallLobby = ({ onJoin } : Props) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasMicPermission && hasCameraPermission;

    return (
        <div className="flex h-full flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="font-medium text-lg">Ready to Join?</h6>
                        <p className="text-sm">Set up your call before joining</p>
                    </div>
                    <VideoPreview
                        DisabledVideoPreview={hasBrowserMediaPermission ?  DisabledVideoPreview : AllowBrowserPermissions}
                    />
                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>
                    <div className="flex gap-x-2 justify-between w-full">
                        <Button asChild variant={"ghost"} className="border border-border text-muted-foreground">
                            <Link href="/meetings">
                                Cancel
                            </Link>
                        </Button>
                        <Button
                            onClick={onJoin}
                        >
                            <LogInIcon />
                            Join Call
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}