import { z } from "zod";

export const MediaCreateSchema = z.object({
    type: z.enum(["IMAGE", "VIDEO"]),
    url: z.string().url(),
    caption: z.string().max(200).optional(),
    order: z.number().int().default(0),
});

export const MediaUpdateSchema = z.object({
    caption: z.string().max(200).optional(),
    order: z.number().int().optional(),
});

export type MediaCreateInput = z.infer<typeof MediaCreateSchema>;
export type MediaUpdateInput = z.infer<typeof MediaUpdateSchema>;
