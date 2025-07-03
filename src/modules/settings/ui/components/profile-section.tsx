"use client";

import {
  generateAvatarUri,
  UserAvatar
} from "@/lib/avatar";
import {
  useEffect,
  useState
} from "react";
import {
  UsersIcon,
  CalendarIcon,
  Share2Icon,
  ClipboardCopyIcon,
} from "lucide-react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface Props {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  stats: {
    agents: number;
    meetings: number;
  };
}

export const ProfileSection = ({ user, stats }: Props) => {
  const [initialsAvatar, setInitialsAvatar] = useState("");
  const [funEmojiAvatar, setFunEmojiAvatar] = useState("");
  const [open, setOpen] = useState(false);

  const referralUrl = `https://meetai-pearl.vercel.app/sign-up/?ref=${encodeURIComponent(user.email)}`;
  const shareText = encodeURIComponent(`Join me on Meet.AI – Build & interact with AI agents!`);

  useEffect(() => {
    setInitialsAvatar(generateAvatarUri({ seed: user.name, variant: "initials" }));
    setFunEmojiAvatar(UserAvatar({ seed: user.name }));
  }, [user.name]);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${referralUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${referralUrl}`,
    whatsapp: `https://wa.me/?text=${shareText}%20${referralUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${referralUrl}`,
    gmail: `mailto:?subject=Join me on Meet.AI&body=${shareText}%0A${referralUrl}`,
    instagram: `https://www.instagram.com/` // Instagram does not support direct sharing
  };

  const handleShareClick = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success("Referral link copied!");
  };

  return (
    <div className="bg-white relative p-6 rounded-2xl shadow-md w-full flex flex-col items-center gap-4 border">
      {/* Avatar with share overlay */}
      {initialsAvatar && funEmojiAvatar && (
        <div className="relative size-32 flip-card">
          <div className="flip-inner w-full h-full relative">
            <img
              src={initialsAvatar}
              alt="Initials Avatar"
              className="rounded-full border shadow flip-front w-full h-full"
            />
            <img
              src={funEmojiAvatar}
              alt="Fun Emoji Avatar"
              className="rounded-full border shadow flip-back w-full h-full"
            />
          </div>
          <button
            onClick={() => setOpen(true)}
            className="absolute bottom-1 right-1 bg-primary border-2 border-white rounded-full p-1 shadow-md"
            aria-label="Share Profile"
          >
            <Share2Icon className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col items-center bg-muted/10 rounded-xl px-4 py-3 shadow-sm">
          <UsersIcon className="w-5 h-5 text-primary mb-1" />
          <p className="text-lg font-semibold">{stats.agents}</p>
          <span className="text-xs text-muted-foreground">Agents Created</span>
        </div>
        <div className="flex flex-col items-center bg-muted/10 rounded-xl px-4 py-3 shadow-sm">
          <CalendarIcon className="w-5 h-5 text-primary mb-1" />
          <p className="text-lg font-semibold">{stats.meetings}</p>
          <span className="text-xs text-muted-foreground">Meetings Held</span>
        </div>
      </div>

      {/* Share Dialog */}
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Share Your Profile"
        description="Invite your friends and earn rewards!"
      >
        <div className="my-4">
          <ScrollArea className="flex items-center gap-4 overflow-x-auto w-full">
            <img src={"/LinkedIN.svg"} onClick={() => handleShareClick("linkedin")} className="size-12 mx-auto" aria-label="LinkedIn" />
            <img src={"/Twitter.svg"} onClick={() => handleShareClick("twitter")} className="size-12 mx-auto" aria-label="Twitter" />
            <img src="/WhatsApp.svg" alt="WhatsApp" onClick={() => handleShareClick("whatsapp")} className="size-12 mx-auto" aria-label="WhatsApp" />
            <img src={"/Facebook.svg"} onClick={() => handleShareClick("facebook")} className="size-12 mx-auto" aria-label="Facebook" />
            <img src={"/Gmail.svg"} alt="Gmail" aria-label="Gmail" className="size-12 border rounded-full mx-auto bg-gray-400" onClick={() => handleShareClick("gmail")} />
            <img src="/Instagram.svg" onClick={() => handleShareClick("instagram")} className="size-12 mx-auto" aria-label="Instagram" alt="Instagram" />
          </ScrollArea>   
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Your Referral Link</label>
          <div className="flex items-center gap-2">
            <input
              value={referralUrl}
              readOnly
              className="w-full text-sm px-3 py-1 border rounded-md bg-muted/10"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              aria-label="Copy referral link"
            >
              <ClipboardCopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
  );
};
