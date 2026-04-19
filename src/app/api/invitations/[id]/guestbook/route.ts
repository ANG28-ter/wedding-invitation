import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const entries = await prisma.guestbook.findMany({
            where: { invitationId: id },
            orderBy: { createdAt: "desc" },
        });
        return ok(entries);
    } catch (err: any) {
        console.error("GET /api/invitations/[id]/guestbook error:", err);
        return bad("Server error", { message: err?.message }, 500);
    }
}
