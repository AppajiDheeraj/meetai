import { z } from "zod";
import { eq } from "drizzle-orm"
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schema";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ input }) => {
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id,input.id))
    return existingAgent;
  }),
  getMany: protectedProcedure.query(async () => {
    const data = await db
      .select()
      .from(agents);
    await new Promise((resolve) => {
      setTimeout(resolve, 5000); // Simulate a delay of 5 second
    })
    return data;
  }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
        
    return createdAgent;
    })
  });

