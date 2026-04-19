import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check if id is actually a slug
        let invitationId = id;
        if (!id.startsWith("cm") && !id.startsWith("cl")) {
            // Likely a slug, find invitation by slug
            const invitation = await prisma.invitation.findUnique({
                where: { slug: id },
                select: { id: true },
            });
            if (!invitation) {
                return bad("Invitation not found", {}, 404);
            }
            invitationId = invitation.id;
        }

        const rsvps = await prisma.rsvp.findMany({
            where: { invitationId },
            orderBy: { createdAt: "desc" },
        });
        return ok(rsvps);
    } catch (err: any) {
        console.error("GET /api/invitations/[id]/rsvp error:", err);
        return bad("Server error", { message: err?.message }, 500);
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Check if id is actually a slug
        let invitationId = id;
        if (!id.startsWith("cm") && !id.startsWith("cl")) {
            // Likely a slug, find invitation by slug
            const invitation = await prisma.invitation.findUnique({
                where: { slug: id },
                select: { id: true },
            });
            if (!invitation) {
                return bad("Invitation not found", {}, 404);
            }
            invitationId = invitation.id;
        }

        // Validate input
        if (!body.guestName || body.guestName.trim().length < 2) {
            return bad("Guest name is required (min 2 characters)", {}, 400);
        }

        if (!["HADIR", "TIDAK", "RAGU"].includes(body.status)) {
            return bad("Invalid status", {}, 400);
        }

        const pax = parseInt(body.pax) || (body.status === "TIDAK" ? 0 : 1);
        if (pax < 0 || pax > 10) {
            return bad("Pax must be between 0 and 10", {}, 400);
        }

        const rsvp = await prisma.rsvp.create({
            data: {
                invitationId,
                guestName: body.guestName.trim(),
                status: body.status,
                pax,
                message: body.message?.trim() || null,
            },
        });

        return ok(rsvp, { status: 201 });
    } catch (err: any) {
        console.error("POST /api/invitations/[id]/rsvp error:", err);
        return bad("Failed to create RSVP", { message: err?.message }, 500);
    }
}
