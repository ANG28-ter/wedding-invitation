import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; eventId: string }> }
) {
    try {
        const { eventId } = await params;
        await prisma.event.delete({
            where: { id: eventId },
        });
        return ok({ message: "Event deleted" });
    } catch (err: any) {
        return bad("Failed to delete event", { message: err?.message }, 500);
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const body = await req.json();

        const event = await prisma.event.update({
            where: { id: eventId },
            data: {
                type: body.type,
                date: body.date ? new Date(body.date) : undefined,
                startTime: body.startTime,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
                endTime: body.endTime,
                venueName: body.venueName,
                address: body.address,
                mapsUrl: body.mapsUrl,
                order: body.order,
            },
        });

        return ok(event);
    } catch (err: any) {
        return bad("Failed to update event", { message: err?.message }, 500);
    }
}
