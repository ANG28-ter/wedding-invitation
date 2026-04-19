import { bad, ok } from "@/lib/http";
import { EventCreateSchema } from "@/server/validators/event.schema";
import { EventService } from "@/server/services/event.service";

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

    const parsed = EventCreateSchema.safeParse(body);
    if (!parsed.success) {
      return bad("Validasi gagal.", parsed.error.flatten(), 422);
    }

    const event = await EventService.createBySlug(slug, parsed.data);
    return ok(event, { status: 201 });
  } catch (err: any) {
    if (err?.message === "INVITATION_NOT_FOUND") {
      return bad("Undangan tidak ditemukan.", undefined, 404);
    }
    console.error("POST /api/invitations/[slug]/events error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) return bad("Slug wajib diisi.", undefined, 400);

    const events = await EventService.listBySlug(slug);
    if (!events) return bad("Undangan tidak ditemukan.", undefined, 404);

    return ok(events);
  } catch (err: any) {
    console.error("GET /api/invitations/[slug]/events error:", err);
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}
