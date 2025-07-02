"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
    meetingCount: number;
    agentCount: number;
    totalDuration: number;
    referralCount?: number;
}

export const AchievementSection = ({
    meetingCount,
    agentCount,
    totalDuration,
}: Props) => {
    const hasAchievements =
        agentCount > 0 || meetingCount === 3 || agentCount === 3 || totalDuration > 0;

    return (
        <div className="mt-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md w-full border mx-auto">
            <h2 className="text-xl font-semibold text-center mb-8">Your Achievements</h2>

            {hasAchievements ? (
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="justify-center flex">
                        <div className="flex gap-6 px-2 pb-2">
                            {agentCount > 0 && (
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/agent-whisperer.svg"
                                        height={100}
                                        width={100}
                                        alt="Agent Whisperer"
                                        className="rounded-md hover:scale-105 transition-transform duration-200 ease-in-out"
                                    />
                                </div>
                            )}
                            {(meetingCount === 3 || agentCount === 3) && (
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/marathoner.svg"
                                        height={100}
                                        width={100}
                                        alt="Marathoner"
                                        className="rounded-md hover:scale-105 transition-transform duration-200 ease-in-out"
                                    />
                                </div>
                            )}
                            {totalDuration > 45 * 60 && (
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/power-hour.svg"
                                        height={100}
                                        width={100}
                                        alt="Power Hour"
                                        className="rounded-md hover:scale-105 transition-transform duration-200 ease-in-out"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            ) : (
                <p className="text-gray-500 text-center">😅 No achievements yet. Keep going!</p>
            )}
        </div>
    );
};


