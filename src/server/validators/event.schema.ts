import { z } from "zod";

const DateString = z
  .string()
  .min(1)
  .refine((v) => !Number.isNaN(Date.parse(v)), "Format tanggal tidak valid.");

export const EventCreateSchema = z.object({
  type: z.string().min(2).max(30),
  date: DateString,
  endDate: DateString.optional(),
  venueName: z.string().min(2).max(120),
  address: z.string().min(5).max(300),
  mapsUrl: z.url().optional(),
});

export type EventCreateInput = z.infer<typeof EventCreateSchema>;
