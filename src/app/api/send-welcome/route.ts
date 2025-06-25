import { sendOnboardingEmail } from "@/lib/email/index";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email || !name) {
    return NextResponse.json({ error: "Missing email or name" }, { status: 400 });
  }

  try {
    await sendOnboardingEmail({
      to: email,
      username: name,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send onboarding email:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
