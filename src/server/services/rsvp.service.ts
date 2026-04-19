import { prisma } from "@/lib/prisma";
import type { RsvpCreateInput } from "@/server/validators/rsvp.schema";

export const RsvpService = {
  async createBySlug(slug: string, input: RsvpCreateInput) {
    const invitation = await prisma.invitation.findUnique({
      where: { slug: slug.toLowerCase().trim() },
      select: { id: true },
    });

    if (!invitation) {
      const err = new Error("INVITATION_NOT_FOUND");
      (err as any).status = 404;
      throw err;
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: invitation.id,
        guestName: input.guestName.trim(),
        status: input.status,
        pax: input.pax,
        message: input.message?.trim(),
      },
      select: {
        id: true,
        guestName: true,
        status: true,
        pax: true,
        message: true,
        createdAt: true,
      },
    });

    return rsvp;
  },

  async listBySlug(slug: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { slug: slug.toLowerCase().trim() },
      select: { id: true },
    });

    if (!invitation) return null;

    const items = await prisma.rsvp.findMany({
      where: { invitationId: invitation.id },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        guestName: true,
        status: true,
        pax: true,
        message: true,
        createdAt: true,
      },
    });

    return items;
  },
};
