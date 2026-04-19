import { prisma } from "@/lib/prisma";
import type { GiftAccountCreateInput, GiftAccountUpdateInput } from "@/server/validators/gift.schema";

export const GiftAccountService = {
    async create(invitationId: string, input: GiftAccountCreateInput) {
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

        const giftAccount = await prisma.giftAccount.create({
            data: {
                invitationId,
                bankName: input.bankName,
                accountNumber: input.accountNumber,
                accountHolder: input.accountHolder,
                qrCodeUrl: input.qrCodeUrl,
                order: input.order ?? 0,
            },
            select: {
                id: true,
                bankName: true,
                accountNumber: true,
                accountHolder: true,
                qrCodeUrl: true,
                order: true,
                createdAt: true,
            },
        });

        return giftAccount;
    },

    async listByInvitationId(invitationId: string) {
        const items = await prisma.giftAccount.findMany({
            where: { invitationId },
            orderBy: { order: "asc" },
            select: {
                id: true,
                bankName: true,
                accountNumber: true,
                accountHolder: true,
                qrCodeUrl: true,
                order: true,
                createdAt: true,
            },
        });

        return items;
    },

    async update(id: string, input: GiftAccountUpdateInput) {
        const existing = await prisma.giftAccount.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            const err = new Error("GIFT_ACCOUNT_NOT_FOUND");
            (err as any).status = 404;
            throw err;
        }

        const updateData: any = {};
        if (input.bankName !== undefined) updateData.bankName = input.bankName;
        if (input.accountNumber !== undefined) updateData.accountNumber = input.accountNumber;
        if (input.accountHolder !== undefined) updateData.accountHolder = input.accountHolder;
        if (input.qrCodeUrl !== undefined) updateData.qrCodeUrl = input.qrCodeUrl;
        if (input.order !== undefined) updateData.order = input.order;

        const updated = await prisma.giftAccount.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                bankName: true,
                accountNumber: true,
                accountHolder: true,
                qrCodeUrl: true,
                order: true,
            },
        });

        return updated;
    },

    async delete(id: string) {
        const existing = await prisma.giftAccount.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            const err = new Error("GIFT_ACCOUNT_NOT_FOUND");
            (err as any).status = 404;
            throw err;
        }

        await prisma.giftAccount.delete({
            where: { id },
        });

        return { success: true };
    },

    async updateOrder(invitationId: string, items: { id: string; order: number }[]) {
        await prisma.$transaction(
            items.map((item) =>
                prisma.giftAccount.update({
                    where: { id: item.id, invitationId },
                    data: { order: item.order },
                })
            )
        );

        return { success: true };
    },
};
