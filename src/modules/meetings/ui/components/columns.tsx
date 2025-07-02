"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MeetingGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avtar"
import { CornerDownRightIcon, CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, ClockFadingIcon, LoaderIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { formatDuration } from "@/lib/utils"
import { cn } from "@/lib/utils"

const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    cancelled: CircleXIcon,
    processing: LoaderIcon,
}

const statusColorMap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
    processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting Name",
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1 ">
                <span className="font-semibold capitalize">{row.original.name}</span>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-1">
                        <CornerDownRightIcon className="size-3 text-muted-foreground" />
                        <span className="text-sm truncate capitalize text-muted-foreground">
                            {row.original.agent.name}
                        </span>
                    </div>
                    <GeneratedAvatar
                    seed={row.original.agent.name}
                    className="size-4"
                    variant="botttsNeutral"
                    />
                    <span className="text-sm text-muted-foreground">{row.original.startedAt ? format(new Date(row.original.startedAt), "MMM d") : ""}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap]
            return (
                <Badge
                variant={"outline"}
                className={cn(
                    "capitalize text-muted-foreground [&>svg]:size-4",
                    statusColorMap[row.original.status as keyof typeof statusColorMap]
                )}
                >
                    <Icon
                    className={cn(
                        row.original.status === "processing" && "animate-spin",
                    )}
                    />
                    {row.original.status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => {
            const duration = row.original.duration;
            return (
                <Badge
                variant={"outline"}
                className="capitalize [&>svg]:size-4 flex items-center"
                >
                    <ClockFadingIcon className="text-blue-700" />
                    {duration ? formatDuration(duration) : "No Duration"}
                </Badge>
            )
        }
    }
]