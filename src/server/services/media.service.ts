import { prisma } from "@/lib/prisma";
import type { MediaCreateInput, MediaUpdateInput } from "@/server/validators/media.schema";

export const MediaService = {
    async create(invitationId: string, input: MediaCreateInput) {
        // Verify invitation exists
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            select: { id: true },
        });

        if (!invitation) {
            const err = new Error("INVITATION_NOT_FOUND");
            (err as any).status = 404;
            throw err;
        }

        const media = await prisma.mediaItem.create({
            data: {
                invitationId,
                type: input.type,
                url: input.url,
                caption: input.caption,
                order: input.order ?? 0,
            },
            select: {
                id: true,
                type: true,
                url: true,
                caption: true,
                order: true,
                createdAt: true,
            },
        });

        return media;
    },

    async listByInvitationId(invitationId: string) {
        const items = await prisma.mediaItem.findMany({
            where: { invitationId },
            orderBy: { order: "asc" },
            select: {
                id: true,
                type: true,
                url: true,
                caption: true,
                order: true,
                createdAt: true,
            },
        });

        return items;
    },

    async update(id: string, input: MediaUpdateInput) {
        const existing = await prisma.mediaItem.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            const err = new Error("MEDIA_NOT_FOUND");
            (err as any).status = 404;
            throw err;
        }

        const updateData: any = {};
        if (input.caption !== undefined) updateData.caption = input.caption;
        if (input.order !== undefined) updateData.order = input.order;

        const updated = await prisma.mediaItem.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                type: true,
                url: true,
                caption: true,
                order: true,
            },
        });

        return updated;
    },

    async delete(id: string) {
        const existing = await prisma.mediaItem.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            const err = new Error("MEDIA_NOT_FOUND");
            (err as any).status = 404;
            throw err;
        }

        await prisma.mediaItem.delete({
            where: { id },
        });

        return { success: true };
    },

    async updateOrder(invitationId: string, items: { id: string; order: number }[]) {
        // Batch update using transaction
        await prisma.$transaction(
            items.map((item) =>
                prisma.mediaItem.update({
                    where: { id: item.id, invitationId }, // Ensure item belongs to invitation
                    data: { order: item.order },
                })
            )
        );

        return { success: true };
    },
};
