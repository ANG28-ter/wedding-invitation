import { z } from "zod";

export const GuestbookCreateSchema = z.object({
  name: z.string().min(2).max(80),
  message: z.string().min(2).max(400),
});

export type GuestbookCreateInput = z.infer<typeof GuestbookCreateSchema>;
