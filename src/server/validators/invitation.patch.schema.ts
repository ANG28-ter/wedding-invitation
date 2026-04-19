import { z } from "zod";

export const InvitationPatchSchema = z.object({
  title: z.string().max(120).optional(),
  groomName: z.string().min(1).max(100).optional(),
  brideName: z.string().min(1).max(100).optional(),
  coverImage: z.union([z.literal(""), z.string().url()]).optional().nullable(),
  coverVideo: z.union([z.literal(""), z.string().url()]).optional().nullable(),

  groomPhotoUrl: z.union([z.literal(""), z.string().url()]).optional().nullable(),
  bridePhotoUrl: z.union([z.literal(""), z.string().url()]).optional().nullable(),
  groomBio: z.string().max(500).optional().nullable(),
  brideBio: z.string().max(500).optional().nullable(),
  groomParents: z.string().max(200).optional().nullable(),
  brideParents: z.string().max(200).optional().nullable(),
  openingQuote: z.string().optional(),
  openingQuoteAuthor: z.string().optional(),
  musicUrl: z.union([z.literal(""), z.string().url()]).optional().nullable(),



  // Theme selection for multi-template support
  theme: z.enum(["jawa-modern", "jawa-kuno", "elegant"]).optional(),
  heroImage: z.union([z.literal(""), z.string().url()]).optional().nullable(),
  rsvtImage: z.union([z.literal(""), z.string().url()]).optional().nullable(),

  groomHandle: z.string().max(100).optional().nullable(),
  brideHandle: z.string().max(100).optional().nullable(),
  groomLocation: z.string().max(200).optional().nullable(),
  brideLocation: z.string().max(200).optional().nullable(),
});

export type InvitationPatchInput = z.infer<typeof InvitationPatchSchema>;
