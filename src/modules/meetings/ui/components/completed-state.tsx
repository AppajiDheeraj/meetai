import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MeetingGetOne } from "../../types"
import Markdown from "react-markdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avtar";
import { format } from "date-fns";
import { formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
    data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-white rounded-lg border px-3">
                    <ScrollArea>
                        <ScrollBar orientation="horizontal" />
                        <TabsList className="p-0 bg-background justify-start rounded-none h-13">
                            <TabsTrigger
                                value="summary"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <BookOpenTextIcon />
                                Summary
                            </TabsTrigger>
                            <TabsTrigger
                                value="transcript"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileTextIcon />
                                Transcript
                            </TabsTrigger>
                            <TabsTrigger
                                value="recording"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileVideoIcon />
                                Recording
                            </TabsTrigger>
                            <TabsTrigger
                                value="chat"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <SparklesIcon />
                                Ask AI
                            </TabsTrigger>
                        </TabsList>              
                    </ScrollArea>
                </div>
                <TabsContent
                    value="recording"
                >
                    <div className="bg-white rounded-lg border px-4 py-5">
                        <video
                            src={data.recordingUrl!}
                            className="w-full rounded-lg"
                            controls
                        />
                    </div>
                </TabsContent>
                <TabsContent
                    value="summary"
                >
                    <div className="bg-white rounded-lg border">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-2xl font-medium capitalize">
                                {data.name}
                            </h2>
                            <div className="flex gap-x-2 items-center">
                                <Link
                                    href={`/agents/${data.agentId}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                                >
                                    <GeneratedAvatar
                                        variant="botttsNeutral"
                                        seed={data.agent.name}
                                        className="size-6"
                                    />
                                    {data.agent.name}
                                </Link> {" "}
                                <p className="text-muted-foreground text-sm">{data.startedAt? format(data.startedAt, "PPP"): "" }</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-4" />
                                <p>General Summary</p>
                            </div>
                            <Badge
                                variant={"outline"}
                                className="flex items-center gap-x-2 [&>svg]:size-4"
                            >
                                <ClockFadingIcon className="text-blue-700" />
                                {data.duration ? formatDuration(data.duration) : "No Duration"}
                            </Badge>
                            <div>
                                <Markdown
                                    components={{
                                        h1: (props) => (
                                            <h1 className="text-2xl font-medium mb-6" {...props} />
                                        ),
                                        h2: (props) => (
                                            <h2 className="text-xl font-medium mb-6" {...props} />
                                        ),
                                        h3: (props) => (
                                            <h3 className="text-lg font-semibold mb-6" {...props} />
                                        ),
                                        h4: (props) => (
                                            <h4 className="text-base font-medium mb-6" {...props} />
                                        ),
                                        p: (props) => (
                                            <p className="text-base mb-6 leading-relaxed" {...props} />
                                        ),
                                        ul: (props) => (
                                            <ul className="list-disc list-inside mb-6" {...props} />
                                        ),
                                        ol: (props) => (
                                            <ol className="mb-6 list-decimal list-inside" {...props} />
                                        ),
                                        li: (props) => (
                                            <li className="mb-1" {...props} />
                                        ),
                                        strong: (props) => (
                                            <strong className="font-semibold" {...props} />
                                        ),
                                        code: (props) => (
                                            <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
                                        ),
                                        blockquote: (props) => (
                                            <blockquote className="border-l-4 border-gray-700 pl-4 italic mb-6" {...props} />
                                        ),
                                    }}
                                >
                                    {data.summary ?? "No summary available."}
                                </Markdown>
                            </div>
                        </div>

                    </div>
                </TabsContent>
                <TabsContent
                    value="transcript"
                >
                    <Transcript meetingId={data.id} />
                </TabsContent>
                <TabsContent
                    value="chat"
                    >
                        <ChatProvider
                            meetingId={data.id}
                            meetingName={data.name}
                        />
                    </TabsContent>
            </Tabs>
        </div>
    )
}