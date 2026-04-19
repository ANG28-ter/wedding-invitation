import { prisma } from "@/lib/prisma";
import { bad, ok } from "@/lib/http";
import { SocialCreateSchema } from "@/server/validators/social.schema";
import { InvitationPatchSchema } from "@/server/validators/invitation.patch.schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const raw = (await params).slug;
    const slug = decodeURIComponent(raw).toLowerCase().trim();
    if (!slug) return bad("Slug wajib diisi.", undefined, 400);

    const inv = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!inv) return bad("Undangan tidak ditemukan.", undefined, 404);

    const items = await prisma.socialLink.findMany({
      where: { invitationId: inv.id },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        platform: true,
        username: true,
        url: true,
        order: true,
      },
    });

    return ok(items);
  } catch (err: any) {
    console.error("GET /api/invitations/[slug]/socials error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const raw = (await params).slug;
    const slug = decodeURIComponent(raw).toLowerCase().trim();
    if (!slug) return bad("Slug wajib diisi.", undefined, 400);

    const body = await req.json().catch(() => null);
    if (!body) return bad("Body JSON tidak valid.", undefined, 400);

    const parsed = SocialCreateSchema.safeParse(body);
    if (!parsed.success)
      return bad("Validasi gagal.", parsed.error.flatten(), 422);

    const inv = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!inv) return bad("Undangan tidak ditemukan.", undefined, 404);

    const created = await prisma.socialLink.create({
      data: {
        invitationId: inv.id,
        platform: parsed.data.platform.toLowerCase().trim(),
        url: parsed.data.url.trim(),
        username: parsed.data.username?.trim(),
        order: parsed.data.order ?? 0,
      },
      select: {
        id: true,
        platform: true,
        username: true,
        url: true,
        order: true,
      },
    });

    return ok(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/invitations/[slug]/socials error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const raw = (await params).slug;
    const slug = decodeURIComponent(raw).toLowerCase().trim();
    if (!slug) return bad("Slug wajib diisi.", undefined, 400);

    const body = await req.json().catch(() => null);
    if (!body) return bad("Body JSON tidak valid.", undefined, 400);

    const parsed = InvitationPatchSchema.safeParse(body);
    if (!parsed.success)
      return bad("Validasi gagal.", parsed.error.flatten(), 422);

    const existing = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) return bad("Undangan tidak ditemukan.", undefined, 404);

    const updated = await prisma.invitation.update({
      where: { slug },
      data: parsed.data,
      select: {
        slug: true,
        title: true,
        coverImage: true,
        coverVideo: true,
        groomPhotoUrl: true,
        bridePhotoUrl: true,
        groomBio: true,
        brideBio: true,
        groomParents: true,
        brideParents: true,
        updatedAt: true,
      },
    });

    return ok(updated);
  } catch (err: any) {
    console.error("PATCH /api/invitations/[slug] error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}
