"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetOne } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avtar"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<AgentGetOne>[] = [
    {
        accessorKey: "name",
        header: "Agent Name",
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1 ">
                <div className="flex items-center gap-x-2 ">
                    <GeneratedAvatar
                        className="size-6"
                        seed={row.original.name}
                        variant="botttsNeutral"
                    />
                    <span className="capitalize font-semibold">
                        {row.original.name}
                    </span>
                </div>
                <div className="flex items-center gap-x-2">
                    <CornerDownRightIcon className="size-3 text-muted-foreground" />
                    <span className="text-sm truncate capitalize w-[200px] text-muted-foreground">
                        {row.original.instructions}
                    </span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "meetings",
        header: "Meetings",
        cell: ({row}) => (
            <Badge variant={"outline"} className="flex items-center gap-x-2 [&>svg]:size-4" >
                <VideoIcon className="text-blue-700" />
                {row.original.meetingCount} {row.original.meetingCount === 1 ? "Meeting" : "Meetings"}
            </Badge>
        )
    }
]