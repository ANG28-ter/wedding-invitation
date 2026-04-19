import { NextRequest, NextResponse } from "next/server";
import { SocialService } from "@/server/services/social.service";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; socialId: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id: invitationId, socialId } = await params;
        const result = await SocialService.delete(socialId);

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
        if (error.message === "SOCIAL_NOT_FOUND") {
            return NextResponse.json(
                { error: "Social link not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
