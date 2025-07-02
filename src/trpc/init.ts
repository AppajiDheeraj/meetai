import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { headers } from "next/headers";
import { polarClient } from "@/lib/polar";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import {
  MAX_FREE_AGENTS,
  MAX_FREE_MEETINGS,
} from "@/modules/premium/constants";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }
  return next({ ctx: { ...ctx, auth: session } });
});

export const premiumProcedure = (entity: "meetings" | "agents") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    const [userMeetings] = await db
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgents] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    const extraLimit = async (userId: string): Promise<number> => {
      try {
        const User = await db
          .select({ referralCount: user.referralCount })
          .from(user)
          .where(eq(user.id, userId))
          .limit(1);

        const referralCount = User[0]?.referralCount ?? 0;
        return Math.floor(referralCount / 5);
      } catch (error) {
        console.error("Error fetching user referral count:", error);
        return 0;
      }
    };
    const bonusLimit = await extraLimit(ctx.auth.user.id);
    const isPremium = customer.activeSubscriptions.length > 0;
    const isFreeAgentLimitReached =
      userAgents.count >= MAX_FREE_AGENTS + bonusLimit;
    const isFreeMeetingLimitReached =
      userMeetings.count >= MAX_FREE_MEETINGS + bonusLimit;

    const shouldThrowMeetingError =
      entity === "meetings" && !isPremium && isFreeMeetingLimitReached;
    const shouldThrowAgentError =
      entity === "agents" && !isPremium && isFreeAgentLimitReached;

    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached your agent limit.",
      });
    }

    if (shouldThrowMeetingError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached your meeting limit.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        customer,
      },
    });
  });
