import { z } from "zod";
import { and, desc, eq, getTableColumns,count, ilike, sql } from "drizzle-orm"
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schema";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ input }) => {
    const [existingAgent] = await db
      .select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`5`
      })
      .from(agents)
      .where(eq(agents.id,input.id))
    return existingAgent;
  }),

  getMany: protectedProcedure.input(z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize:z
      .number()
      .min(MIN_PAGE_SIZE)
      .max(MAX_PAGE_SIZE)
      .default(DEFAULT_PAGE_SIZE),
    search: z.string().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { search, page, pageSize } = input;
    const data = await db
      .select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`5`
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined
        )
      )
      .orderBy(desc(agents.createdAt),desc(agents.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [total] = await db
      .select({
        count: count()
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined
        )
      );

      const totalPages = Math.ceil(total.count / pageSize); 

    return {
      items: data,
      totalCount: total.count,
      totalPages,
    };
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

