import { prisma } from "@/lib/prisma";
import type { SocialCreateInput } from "@/server/validators/social.schema";

export const SocialService = {
    async create(invitationId: string, input: SocialCreateInput) {
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

        const social = await prisma.socialLink.create({
            data: {
                invitationId,
                platform: input.platform,
                url: input.url,
                username: input.username,
                order: input.order ?? 0,
            },
            select: {
                id: true,
                platform: true,
                url: true,
                username: true,
                order: true,
                createdAt: true,
            },
        });

        return social;
    },

    async listByInvitationId(invitationId: string) {
        const items = await prisma.socialLink.findMany({
            where: { invitationId },
            orderBy: { order: "asc" },
            select: {
                id: true,
                platform: true,
                url: true,
                username: true,
                order: true,
                createdAt: true,
            },
        });

        return items;
    },

    async update(id: string, input: Partial<SocialCreateInput>) {
        const existing = await prisma.socialLink.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            const err = new Error("SOCIAL_NOT_FOUND");
            (err as any).status = 404;
            throw err;
        }

        const updateData: any = {};
        if (input.platform !== undefined) updateData.platform = input.platform;
        if (input.url !== undefined) updateData.url = input.url;
        if (input.username !== undefined) updateData.username = input.username;
        if (input.order !== undefined) updateData.order = input.order;

        const updated = await prisma.socialLink.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                platform: true,
                url: true,
                username: true,
                order: true,
            },
        });

        return updated;
    },

    async delete(id: string) {
        const existing = await prisma.socialLink.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            const err = new Error("SOCIAL_NOT_FOUND");
            (err as any).status = 404;
            throw err;
        }

        await prisma.socialLink.delete({
            where: { id },
        });

        return { success: true };
    },
};
