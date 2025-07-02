// app/api/referral/route.ts
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { ref } = await req.json();
  if (!ref) return NextResponse.json({ error: "No ref provided" }, { status: 400 });

  const [referrer] = await db.select().from(user).where(eq(user.email, ref));
  if (referrer) {
    await db.update(user)
      .set({ referralCount: sql`${user.referralCount} + 1` })
      .where(eq(user.id, referrer.id));
  }

  return NextResponse.json({ success: true });
}
