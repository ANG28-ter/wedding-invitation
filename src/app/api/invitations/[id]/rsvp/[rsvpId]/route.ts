import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; rsvpId: string }> }
) {
    try {
        const { rsvpId } = await params;
        await prisma.rsvp.delete({
            where: { id: rsvpId },
        });
        return ok({ message: "RSVP deleted" });
    } catch (err: any) {
        console.error("DELETE /api/invitations/[id]/rsvp/[rsvpId] error:", err);
        return bad("Failed to delete RSVP", { message: err?.message }, 500);
    }
}
