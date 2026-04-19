import { prisma } from "@/lib/prisma";
import { bad, ok } from "@/lib/http";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params; // ✅ wajib await

    if (!slug) return bad("Slug wajib diisi.", undefined, 400);

    const invitation = await prisma.invitation.findUnique({
      where: { slug: slug.toLowerCase().trim() },
      select: {
        id: true,
        slug: true,
        title: true,
        groomName: true,
        brideName: true,
        coverImage: true,
        coverVideo: true,
        theme: true,
        createdAt: true,
        updatedAt: true,
        events: {
          orderBy: { date: "asc" },
          select: {
            id: true,
            type: true,
            date: true,
            endDate: true,
            venueName: true,
            address: true,
            mapsUrl: true,
            createdAt: true,
          },
        },
        groomPhotoUrl: true,
        bridePhotoUrl: true,
        groomBio: true,
        brideBio: true,
        groomParents: true,
        brideParents: true,

        socialLinks: {
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          select: {
            id: true,
            platform: true,
            username: true,
            url: true,
            order: true,
          },
        },

        mediaItems: {
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          select: {
            id: true,
            type: true,
            url: true,
            caption: true,
            order: true,
            createdAt: true,
          },
        },
      },
    });

    if (!invitation) {
      return bad("Undangan tidak ditemukan.", { slug }, 404);
    }

    return ok(invitation);
  } catch (err: any) {
    console.error("GET /api/invitations/[slug] error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}
