"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PencilIcon, CheckIcon } from "lucide-react";
import { GeneratedAvatar } from "@/components/generated-avtar";

export function ProfileSection({ user }: { user: { name: string; email: string; image?: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    // TODO: Call API to update username
    setIsEditing(false);
    alert("Username updated successfully!");
  };

  return (
    <div className="flex items-center p-6 gap-x-6 bg-background/20 border border-border rounded-2xl w-full shadow-xs">
      <div className="shrink-0">
        {user.image ? (
          <Avatar className="size-28 border border-muted rounded-full shadow">
            <AvatarImage src={user.image} alt={user.name ?? 'User Avatar'} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={user.name ?? 'User'}
            variant="initials"
            className="size-28 border border-muted rounded-full shadow"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-64"
            />
            <Button size="sm" variant="default" onClick={handleSave}>
              <CheckIcon className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h2 className="text-xl font-semibold">{name}</h2>
            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        )}
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
