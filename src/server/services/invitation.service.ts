import { prisma } from "@/lib/prisma";
import type { InvitationCreateInput } from "@/server/validators/invitation.schema";
import type { InvitationPatchInput } from "@/server/validators/invitation.patch.schema";
import { customAlphabet } from "nanoid";

// slug suffix pendek biar tetap unik kalau nama sama
const nano = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueSlug(base: string) {
  let candidate = base;
  // cek dulu base slug
  const existing = await prisma.invitation.findUnique({
    where: { slug: candidate },
  });
  if (!existing) return candidate;

  // kalau sudah ada, tambahkan suffix nanoid
  // ulang sampai ketemu yang kosong
  for (let i = 0; i < 5; i++) {
    candidate = `${base}-${nano()}`;
    const found = await prisma.invitation.findUnique({
      where: { slug: candidate },
    });
    if (!found) return candidate;
  }

  // fallback terakhir (sangat jarang)
  return `${base}-${Date.now().toString(36)}`;
}

export const InvitationService = {
  async create(input: InvitationCreateInput) {
    const theme = input.theme ?? "jawa-modern";

    // slug: pakai input.slug kalau ada, kalau tidak: gabung nama
    const baseSlugRaw = input.slug ?? `${input.groomName}-${input.brideName}`;
    const baseSlug = slugify(baseSlugRaw);

    if (!baseSlug || baseSlug.length < 3) {
      throw new Error("SLUG_INVALID");
    }

    const slug = await ensureUniqueSlug(baseSlug);

    const invitation = await prisma.invitation.create({
      data: {
        slug,
        title: input.title,
        groomName: input.groomName,
        brideName: input.brideName,
        coverImage: input.coverImage,
        coverVideo: input.coverVideo,
        theme,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        groomName: true,
        brideName: true,
        coverImage: true,
        coverVideo: true,
        theme: true,
        heroImage: true,
        createdAt: true,
      },
    });

    return invitation;
  },

  async getById(id: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { date: "asc" },
        },
        socialLinks: {
          orderBy: { order: "asc" },
        },
        mediaItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!invitation) {
      const err = new Error("INVITATION_NOT_FOUND");
      (err as any).status = 404;
      throw err;
    }

    return invitation;
  },

  async update(id: string, input: InvitationPatchInput) {
    // Verify invitation exists
    const existing = await prisma.invitation.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      const err = new Error("INVITATION_NOT_FOUND");
      (err as any).status = 404;
      throw err;
    }

    // Build update data object (only include provided fields)
    const updateData: any = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.groomName !== undefined) updateData.groomName = input.groomName;
    if (input.brideName !== undefined) updateData.brideName = input.brideName;
    if (input.coverImage !== undefined) updateData.coverImage = input.coverImage;
    if (input.coverVideo !== undefined) updateData.coverVideo = input.coverVideo;
    if (input.groomPhotoUrl !== undefined) updateData.groomPhotoUrl = input.groomPhotoUrl;
    if (input.bridePhotoUrl !== undefined) updateData.bridePhotoUrl = input.bridePhotoUrl;
    if (input.groomBio !== undefined) updateData.groomBio = input.groomBio;
    if (input.brideBio !== undefined) updateData.brideBio = input.brideBio;
    if (input.groomParents !== undefined) updateData.groomParents = input.groomParents;
    if (input.brideParents !== undefined) updateData.brideParents = input.brideParents;
    if (input.openingQuote !== undefined) updateData.openingQuote = input.openingQuote;
    if (input.openingQuoteAuthor !== undefined) updateData.openingQuoteAuthor = input.openingQuoteAuthor;
    if (input.theme !== undefined) updateData.theme = input.theme;
    if (input.heroImage !== undefined) updateData.heroImage = input.heroImage;
    if (input.groomHandle !== undefined) updateData.groomHandle = input.groomHandle;
    if (input.brideHandle !== undefined) updateData.brideHandle = input.brideHandle;
    if (input.groomLocation !== undefined) updateData.groomLocation = input.groomLocation;
    if (input.brideLocation !== undefined) updateData.brideLocation = input.brideLocation;
    if (input.rsvtImage !== undefined) updateData.rsvtImage = input.rsvtImage;
    if (input.musicUrl !== undefined) updateData.musicUrl = input.musicUrl;

    const updated = await prisma.invitation.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        slug: true,
        title: true,
        groomName: true,
        brideName: true,
        coverImage: true,
        coverVideo: true,
        theme: true,
        heroImage: true,
        groomHandle: true,
        brideHandle: true,
        groomLocation: true,
        brideLocation: true,
        rsvtImage: true,
        musicUrl: true,
        updatedAt: true,
      },
    });

    return updated;
  },

  async delete(id: string) {
    // Verify invitation exists
    const existing = await prisma.invitation.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!existing) {
      const err = new Error("INVITATION_NOT_FOUND");
      (err as any).status = 404;
      throw err;
    }

    // Delete (cascade will handle related records)
    await prisma.invitation.delete({
      where: { id },
    });

    return { success: true, slug: existing.slug };
  },
};
