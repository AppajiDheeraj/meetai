import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "@/modules/premium/constants";
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

export const DashboardTrial = () => {
    const trpc = useTRPC();
    
    const { data } = useQuery(
        trpc.premium.getFreeUsage.queryOptions()
    );

    if (!data) {
        return null;
    }

    const { agentCount, meetingCount, maxFreeAgents, maxFreeMeetings, bonusLimit } = data;

    return (
        <div className="border border-border/10 rounded-lg bg-white/5 flex flex-col gap-y-2">
            <div className="p-3 flex flex-col gap-y-4">
                <div className="flex items-center gap-2">
                    <RocketIcon className="size-4" />
                    <p className="text-sm font-medium">Free Trial</p>
                </div>
                <div className="flex flex-col gap-y-2">
                    <p className="text-xs">
                        {agentCount}/{maxFreeAgents} Agents
                    </p>
                    <Progress value={(agentCount/maxFreeAgents) * 100} />
                </div>
                <div className="flex flex-col gap-y-2">
                    <p className="text-xs">
                        {meetingCount}/{maxFreeMeetings} Meetings
                    </p>
                    <Progress value={(meetingCount/maxFreeMeetings) * 100} />
                </div>
            </div>
            <Button
                asChild
                className="bg-transparent border-t border-border/10 hover:bg-white/10 rounded-t-none"
            >
                <Link href="/upgrade">
                    Upgrade
                </Link>
            </Button>
        </div>
    )
}