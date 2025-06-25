import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import {
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallRecordingReadyEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(request: NextRequest) {
  console.log("📩 Webhook called");

  const signature = request.headers.get("x-signature");
  const apiKey = request.headers.get("x-api-key");

  if (!signature || !apiKey) {
    console.warn("❌ Missing signature or API key");
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }

  const body = await request.text();
  console.log("📦 Raw body:", body);

  if (!verifySignatureWithSDK(body, signature)) {
    console.warn("❌ Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
    console.log("✅ Parsed payload:", payload);
  } catch {
    console.error("❌ Failed to parse JSON");
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const eventType = (payload as any)?.type;
  console.log("📡 Event type:", eventType);

  if (eventType === "call.session_started") {
    console.log("🎯 Handling call.session_started");

    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      console.warn("❌ Missing meeting ID in custom field");
      return NextResponse.json(
        { error: "Missing meeting ID" },
        { status: 400 }
      );
    }

    console.log("🪪 Meeting ID:", meetingId);

    const [existedMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existedMeeting) {
      console.warn("❌ Meeting not found or already started");
      return NextResponse.json(
        { error: "Meeting not found or already started" },
        { status: 404 }
      );
    }

    await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(meetings.id, existedMeeting.id));

    const [existedAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existedMeeting.agentId));

    if (!existedAgent) {
      console.warn("❌ Agent not found");
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    try {
      console.log("📞 Connecting to Stream Call...");

      const call = streamVideo.video.call("default", meetingId);
      const realTimeClient = await streamVideo.video.connectOpenAi({
        call,
        openAiApiKey: process.env.OPENAI_API_KEY!,
        agentUserId: existedAgent.id,
      });

      console.log("🤖 Agent connected!");

      realTimeClient.updateSession({
        instructions: existedAgent.instructions,
      });

      console.log("✅ Instructions updated");
    } catch (err) {
      console.error("❌ connectOpenAi() failed", err);
    }
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      console.warn("❌ Missing meeting ID in call_cid");
      return NextResponse.json(
        { error: "Missing meeting ID" },
        { status: 400 }
      );
    }

    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  }

  return NextResponse.json({ status: "ok" });
}