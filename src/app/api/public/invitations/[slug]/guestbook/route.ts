import { bad, ok } from "@/lib/http";
import { z } from "zod";
import { GuestbookCreateSchema } from "@/server/validators/guestbook.schema";
import { GuestbookService } from "@/server/services/guestbook.service";

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

    const parsed = GuestbookCreateSchema.safeParse(body);
    if (!parsed.success) {
      return bad("Validasi gagal.", z.treeifyError(parsed.error), 422);
    }

    const item = await GuestbookService.createBySlug(slug, parsed.data);
    return ok(item, { status: 201 });
  } catch (err: any) {
    if (err?.message === "INVITATION_NOT_FOUND") {
      return bad("Undangan tidak ditemukan.", undefined, 404);
    }
    console.error("POST /api/invitations/[slug]/guestbook error:", err);
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

    const items = await GuestbookService.listApprovedBySlug(slug);
    if (!items) return bad("Undangan tidak ditemukan.", undefined, 404);

    return ok(items);
  } catch (err: any) {
    console.error("GET /api/invitations/[slug]/guestbook error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}
