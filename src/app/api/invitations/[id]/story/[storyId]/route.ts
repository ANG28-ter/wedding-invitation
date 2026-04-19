import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

type Params = {
    params: Promise<{ id: string; storyId: string }>;
};

// PATCH /api/invitations/[id]/story/[storyId]
export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { storyId } = await params;
        const body = await req.json();

        const story = await prisma.story.update({
            where: { id: storyId },
            data: {
                title: body.title,
                description: body.description,
                date: body.date ? new Date(body.date) : null,
                imageUrl: body.imageUrl || undefined,
                order: body.order,
                category: body.category || undefined,
            },
        });

        return ok(story);
    } catch (err: any) {
        return bad("Failed to update story", { message: err?.message }, 500);
    }
}

// DELETE /api/invitations/[id]/story/[storyId]
export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { storyId } = await params;

        await prisma.story.delete({
            where: { id: storyId },
        });

        return ok({ success: true });
    } catch (err: any) {
        return bad("Failed to delete story", { message: err?.message }, 500);
    }
}
