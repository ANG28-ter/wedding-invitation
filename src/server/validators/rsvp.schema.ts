import { z } from "zod";

export const RsvpCreateSchema = z.object({
  guestName: z.string().min(2).max(80),
  status: z.enum(["HADIR", "TIDAK", "RAGU"]),
  pax: z.number().int().min(1).max(10).default(1),
  message: z.string().max(300).optional(),
});

export type RsvpCreateInput = z.infer<typeof RsvpCreateSchema>;
