import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface GeneratedAvatarProps {
    seed: string;
    variant: "botttsNeutral" | "initials";
}

export const generateAvatarUri = ({
    seed,
    variant
}: GeneratedAvatarProps) => {
    let avatar;

    if (variant === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, {
            seed,
        });
    } else {
        avatar = createAvatar(initials, {
            seed,
            fontWeight: 500,
            fontSize: 42,
        });
    }

    return avatar.toDataUri();
}