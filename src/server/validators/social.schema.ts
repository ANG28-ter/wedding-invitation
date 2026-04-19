import { z } from "zod";

export const SocialCreateSchema = z.object({
  platform: z.string().min(2).max(30),
  url: z.url(),
  username: z.string().max(60).optional(),
  order: z.number().int().min(0).max(99).optional(),
});

export type SocialCreateInput = z.infer<typeof SocialCreateSchema>;
