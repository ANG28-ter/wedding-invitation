import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const events = await prisma.event.findMany({
            where: { invitationId: id },
            orderBy: { order: "asc" },
        });
        return ok(events);
    } catch (err: any) {
        console.error("GET /api/invitations/[id]/events error:", err);
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

        const event = await prisma.event.create({
            data: {
                invitationId: id,
                type: body.type,
                date: new Date(body.date),
                startTime: body.startTime || undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
                endTime: body.endTime || undefined,
                venueName: body.venueName,
                address: body.address,
                mapsUrl: body.mapsUrl || undefined,
                order: body.order || 0,
            },
        });

        return ok(event, { status: 201 });
    } catch (err: any) {
        console.error("POST /api/invitations/[id]/events error:", err);
        return bad("Failed to create event", { message: err?.message }, 500);
    }
}
