import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
export type AgentsGetMany = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];

