import { z } from "zod";

export const meetingsInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  agentId: z.string().min(1, "Agent is required"),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1,{ message: "ID is required"}),
})