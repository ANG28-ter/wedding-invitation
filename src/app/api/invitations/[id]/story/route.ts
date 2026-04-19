import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

type Params = {
    params: Promise<{ id: string }>;
};

// GET /api/invitations/[id]/story
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const stories = await prisma.story.findMany({
            where: { invitationId: id },
            orderBy: { order: "asc" },
        });

        return ok(stories);
    } catch (err: any) {
        return bad("Failed to fetch stories", { message: err?.message }, 500);
    }
}

// POST /api/invitations/[id]/story
export async function POST(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const body = await req.json();

        const story = await prisma.story.create({
            data: {
                invitationId: id,
                title: body.title,
                description: body.description,
                date: body.date ? new Date(body.date) : null,
                imageUrl: body.imageUrl || null,
                order: body.order || 0,
                category: body.category || "Default",
            },
        });

        return ok(story, { status: 201 });
    } catch (err: any) {
        return bad("Failed to create story", { message: err?.message }, 500);
    }
}
