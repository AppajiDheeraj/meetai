"use client"

import { Separator } from "@/components/ui/separator";
import { ProfileSection } from "../components/profile-section"
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { AchievementSection } from "../components/achievement-section";
import { SettingsSection } from "../components/settings-section";

export const SettingsView = () => {
    const trpc = useTRPC();
    const { data } = authClient.useSession();
    const { data: stats} = useQuery(
        trpc.settings.getStats.queryOptions(),
    );

    return (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground mb-4">Manage your account settings and preferences.</p>
            <Separator className="mb-4 text-black" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-1">
                                    {data?.user && (
                    <>
                        <ProfileSection
                            user={{
                                name: data.user.name,
                                email: data.user.email,
                                image: data.user.image ?? undefined,
                            }}
                            stats={{
                                agents: stats?.agentCount ?? 0,
                                meetings: stats?.meetingCount ?? 0,
                            }}
                        />
                        <div>
                            <AchievementSection
                                meetingCount={stats?.meetingCount ?? 0}
                                agentCount={stats?.agentCount ?? 0}
                                totalDuration={Number(stats?.totalDuration ?? 0)}
                            />
                        </div>
                    </>
                )}
                </div>
                <div className="col-span-1 md:col-span-2"> 
                    <SettingsSection />
                </div>
            </div>
        </div>
    )
}
