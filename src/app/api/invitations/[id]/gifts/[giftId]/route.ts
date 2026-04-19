import { NextRequest, NextResponse } from "next/server";
import { GiftAccountService } from "@/server/services/gift.service";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; giftId: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id: invitationId, giftId } = await params;
        const result = await GiftAccountService.delete(giftId);

        // Get invitation slug for cache revalidation
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            select: { slug: true },
        });

        if (invitation) {
            revalidatePath(`/${invitation.slug}`);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        if (error.message === "GIFT_ACCOUNT_NOT_FOUND") {
            return NextResponse.json(
                { error: "Gift account not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
