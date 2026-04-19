import { NextRequest, NextResponse } from "next/server";
import { GiftAccountService } from "@/server/services/gift.service";
import { GiftAccountCreateSchema } from "@/server/validators/gift.schema";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id: invitationId } = await params;
        const items = await GiftAccountService.listByInvitationId(invitationId);
        return NextResponse.json(items);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const { id: invitationId } = await params;
        const body = await req.json();

        // Validate input
        const validated = GiftAccountCreateSchema.parse(body);

        const gift = await GiftAccountService.create(invitationId, validated);

        // Get invitation slug for cache revalidation
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            select: { slug: true },
        });

        if (invitation) {
            revalidatePath(`/${invitation.slug}`);
        }

        return NextResponse.json(gift, { status: 201 });
    } catch (error: any) {
        if (error.message === "INVITATION_NOT_FOUND") {
            return NextResponse.json(
                { error: "Invitation not found" },
                { status: 404 }
            );
        }
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        );
    }
}
