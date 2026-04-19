import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "@/server/services/media.service";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; mediaId: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id: invitationId, mediaId } = await params;
        const result = await MediaService.delete(mediaId);

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
        if (error.message === "MEDIA_NOT_FOUND") {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
