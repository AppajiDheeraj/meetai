import { protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents, meetings, account, user } from "@/db/schema";
import { count, eq, sum, sql, isNotNull, and } from "drizzle-orm";
import { createTRPCRouter } from "@/trpc/init";
import { settingsUpdateSchema } from "../schema";

export const settingsRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [[{ agentCount }], [{ meetingCount }], [{ totalDuration }]] =
      await Promise.all([
        db
          .select({ agentCount: count() })
          .from(agents)
          .where(eq(agents.userId, ctx.auth.user.id)),

        db
          .select({ meetingCount: count() })
          .from(meetings)
          .where(eq(meetings.userId, ctx.auth.user.id)),

        db
          .select({
            totalDuration: sum(
              sql`EXTRACT(EPOCH FROM ${meetings.endedAt} - ${meetings.startedAt})`
            ),
          })
          .from(meetings)
          .where(
            and(
              eq(meetings.userId, ctx.auth.user.id),
              isNotNull(meetings.startedAt),
              isNotNull(meetings.endedAt)
            )
          ),
      ]);

    return {
      agentCount,
      meetingCount,
      totalDuration: totalDuration ?? 0, // in seconds
    };
  }),
  updateSettings: protectedProcedure
    .input(settingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { fullName, phone, location, twoFactorEnabled } = input;

      const [updated] = await db
        .update(user)
        .set({
          name: fullName,
          phone,
          location,
          twoFactorEnabled,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.auth.user.id))
        .returning();

      return updated;
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [u] = await db
      .select()
      .from(user)
      .where(eq(user.id, ctx.auth.user.id));

    const [a] = await db
      .select({ password: account.password })
      .from(account)
      .where(eq(account.userId, ctx.auth.user.id));

    return {
      ...u,
      hasPassword: !!a?.password,
      referralCount: u?.referralCount ?? 0,
    };
  }),
});
