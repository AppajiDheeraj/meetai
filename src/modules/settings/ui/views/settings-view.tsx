"use client"

import { ProfileSection } from "../components/profile-section"
import { authClient } from "@/lib/auth-client";

export const SettingsView = () => {
    const { data, isPending } = authClient.useSession();
    return(
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground mb-4">Manage your account settings and preferences.</p>
            <div className="flex items-center gap-y-4">
                {data?.user && (
                    <ProfileSection
                        user={{
                            name: data.user.name,
                            email: data.user.email,
                            image: data.user.image ?? undefined,
                        }}
                    />
                )}
            </div>
        </div>
    )
}
