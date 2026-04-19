import { prisma } from "@/lib/prisma";
import type { EventCreateInput } from "@/server/validators/event.schema";

export const EventService = {
  async createBySlug(slug: string, input: EventCreateInput) {
    const normalized = slug.toLowerCase().trim();

    const invitation = await prisma.invitation.findUnique({
      where: { slug: normalized },
      select: { id: true, slug: true },
    });

    if (!invitation) {
      const err = new Error("INVITATION_NOT_FOUND");
      (err as any).status = 404;
      throw err;
    }

    const event = await prisma.event.create({
      data: {
        invitationId: invitation.id,
        type: input.type.toUpperCase(),
        date: new Date(input.date),
        endDate: input.endDate ? new Date(input.endDate) : null,
        venueName: input.venueName,
        address: input.address,
        mapsUrl: input.mapsUrl,
      },
      select: {
        id: true,
        type: true,
        date: true,
        endDate: true,
        venueName: true,
        address: true,
        mapsUrl: true,
        createdAt: true,
      },
    });

    return event;
  },

  async listBySlug(slug: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!invitation) return null;

    const events = await prisma.event.findMany({
      where: { invitationId: invitation.id },
      orderBy: { date: "asc" },
      select: {
        id: true,
        type: true,
        date: true,
        endDate: true,
        venueName: true,
        address: true,
        mapsUrl: true,
        createdAt: true,
      },
    });

    return events;
  },
};
