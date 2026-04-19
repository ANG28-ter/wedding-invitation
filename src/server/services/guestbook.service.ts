import { prisma } from "@/lib/prisma";
import type { GuestbookCreateInput } from "@/server/validators/guestbook.schema";

export const GuestbookService = {
  async createBySlug(slug: string, input: GuestbookCreateInput) {
    const invitation = await prisma.invitation.findUnique({
      where: { slug: slug.toLowerCase().trim() },
      select: { id: true },
    });

    if (!invitation) {
      const err = new Error("INVITATION_NOT_FOUND");
      (err as any).status = 404;
      throw err;
    }

    const item = await prisma.guestbook.create({
      data: {
        invitationId: invitation.id,
        name: input.name.trim(),
        message: input.message.trim(),
        isApproved: true, // MVP: auto-approve (nanti bisa dibuat moderasi)
      },
      select: {
        id: true,
        name: true,
        message: true,
        isApproved: true,
        createdAt: true,
      },
    });

    return item;
  },

  async listApprovedBySlug(slug: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { slug: slug.toLowerCase().trim() },
      select: { id: true },
    });

    if (!invitation) return null;

    const items = await prisma.guestbook.findMany({
      where: {
        invitationId: invitation.id,
        isApproved: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        message: true,
        createdAt: true,
      },
    });

    return items;
  },
};
