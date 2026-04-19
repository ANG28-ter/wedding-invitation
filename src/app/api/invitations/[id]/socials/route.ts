import { NextRequest, NextResponse } from "next/server";
import { SocialService } from "@/server/services/social.service";
import { SocialCreateSchema } from "@/server/validators/social.schema";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id: invitationId } = await params;
        const items = await SocialService.listByInvitationId(invitationId);
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
        const validated = SocialCreateSchema.parse(body);

        const social = await SocialService.create(invitationId, validated);

        // Get invitation slug for cache revalidation
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            select: { slug: true },
        });

        if (invitation) {
            revalidatePath(`/${invitation.slug}`);
        }

        return NextResponse.json(social, { status: 201 });
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
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
