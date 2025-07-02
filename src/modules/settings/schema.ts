import { twoFactor } from "better-auth/plugins";
import { z } from "zod";

export const settingsUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  twoFactorEnabled: z.boolean(),
});
