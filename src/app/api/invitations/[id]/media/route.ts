import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "@/server/services/media.service";
import { MediaCreateSchema } from "@/server/validators/media.schema";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id: invitationId } = await params;
        const items = await MediaService.listByInvitationId(invitationId);
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

        console.log("Media API - Received body:", body);

        // Validate input
        const validated = MediaCreateSchema.parse(body);

        console.log("Media API - Validated data:", validated);

        const media = await MediaService.create(invitationId, validated);

        // Get invitation slug for cache revalidation
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            select: { slug: true },
        });

        if (invitation) {
            // Revalidate public invitation page
            revalidatePath(`/${invitation.slug}`);
        }

        return NextResponse.json(media, { status: 201 });
    } catch (error: any) {
        console.error("Media API Error:", error);

        if (error.message === "INVITATION_NOT_FOUND") {
            return NextResponse.json(
                { error: "Invitation not found" },
                { status: 404 }
            );
        }
        if (error.name === "ZodError") {
            console.error("Zod validation errors:", error.issues);
            return NextResponse.json(
                { error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        );
    }
}
