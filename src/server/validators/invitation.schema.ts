import { z } from "zod";

export const InvitationCreateSchema = z.object({
  // opsional: kalau kosong, server akan bikin dari nama
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug harus lowercase dan boleh pakai '-'"
    )
    .optional(),

  title: z.string().max(120).optional(),

  groomName: z.string().min(1).max(80),
  brideName: z.string().min(1).max(80),

  coverImage: z.string().url().optional(),
  coverVideo: z.string().url().optional(),

  theme: z.string().min(1).max(60).optional(),

});

export type InvitationCreateInput = z.infer<typeof InvitationCreateSchema>;
