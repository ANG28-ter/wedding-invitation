import { prisma } from "@/lib/prisma";
import { bad, ok } from "@/lib/http";
import { z } from "zod";

const MediaCreateSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.url(),
  caption: z.string().max(120).optional(),
  order: z.number().int().min(0).max(999).optional(),
});

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

    const parsed = MediaCreateSchema.safeParse(body);
    if (!parsed.success)
      return bad("Validasi gagal.", parsed.error.flatten(), 422);

    const inv = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!inv) return bad("Undangan tidak ditemukan.", undefined, 404);

    const created = await prisma.mediaItem.create({
      data: {
        invitationId: inv.id,
        type: parsed.data.type,
        url: parsed.data.url.trim(),
        caption: parsed.data.caption?.trim(),
        order: parsed.data.order ?? 0,
      },
      select: {
        id: true,
        type: true,
        url: true,
        caption: true,
        order: true,
        createdAt: true,
      },
    });

    return ok(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/invitations/[slug]/media error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}

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

    const items = await prisma.mediaItem.findMany({
      where: { invitationId: inv.id },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        type: true,
        url: true,
        caption: true,
        order: true,
        createdAt: true,
      },
    });

    return ok(items);
  } catch (err: any) {
    console.error("GET /api/invitations/[slug]/media error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}
