import { prisma } from "@/lib/prisma";
import { ok, bad } from "@/lib/http";
import { NextRequest } from "next/server";

type Params = {
    params: Promise<{ slug: string }>;
};

// GET /api/public/invitations/[slug]/story
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;

        // Find invitation by slug
        const invitation = await prisma.invitation.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!invitation) {
            return bad("Invitation not found", {}, 404);
        }

        // Fetch stories ordered by order field
        const stories = await prisma.story.findMany({
            where: { invitationId: invitation.id },
            orderBy: { order: "asc" },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                imageUrl: true,
                order: true,
            },
        });

        return ok(stories);
    } catch (err: any) {
        return bad("Failed to fetch stories", { message: err?.message }, 500);
    }
}
