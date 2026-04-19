import { NextRequest, NextResponse } from "next/server";
import { InvitationService } from "@/server/services/invitation.service";
import { InvitationPatchSchema } from "@/server/validators/invitation.patch.schema";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const invitation = await InvitationService.getById(id);
        return NextResponse.json(invitation);
    } catch (error: any) {
        if (error.message === "INVITATION_NOT_FOUND") {
            return NextResponse.json(
                { error: "Invitation not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Validate input
        const validated = InvitationPatchSchema.parse(body);

        const updated = await InvitationService.update(id, validated);

        // Revalidate the public invitation page to show updated theme
        revalidatePath(`/${updated.slug}`);

        return NextResponse.json(updated);
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
        console.error("PATCH /api/invitations/[id] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const result = await InvitationService.delete(id);
        return NextResponse.json(result);
    } catch (error: any) {
        if (error.message === "INVITATION_NOT_FOUND") {
            return NextResponse.json(
                { error: "Invitation not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
