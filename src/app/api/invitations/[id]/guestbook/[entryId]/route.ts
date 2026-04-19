import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; entryId: string }> }
) {
    try {
        const { entryId } = await params;
        const body = await req.json();

        const entry = await prisma.guestbook.update({
            where: { id: entryId },
            data: {
                isApproved: body.isApproved,
            },
        });

        return ok(entry);
    } catch (err: any) {
        console.error("PATCH /api/invitations/[id]/guestbook/[entryId] error:", err);
        return bad("Failed to update entry", { message: err?.message }, 500);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; entryId: string }> }
) {
    try {
        const { entryId } = await params;
        await prisma.guestbook.delete({
            where: { id: entryId },
        });
        return ok({ message: "Entry deleted" });
    } catch (err: any) {
        console.error("DELETE /api/invitations/[id]/guestbook/[entryId] error:", err);
        return bad("Failed to delete entry", { message: err?.message }, 500);
    }
}
