import { InvitationCreateSchema } from "@/server/validators/invitation.schema";
import { InvitationService } from "@/server/services/invitation.service";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return bad("Body JSON tidak valid.");

    const parsed = InvitationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return bad("Validasi gagal.", parsed.error.issues, 422);
    }

    const created = await InvitationService.create(parsed.data);

    return ok(created, { status: 201 });
  } catch (err: any) {
    // error internal yang kita set sendiri
    if (err?.message === "SLUG_INVALID") {
      return bad(
        "Slug tidak valid. Pastikan minimal 3 karakter dan format benar.",
        undefined,
        400
      );
    }

    // fallback
    return bad("Terjadi error di server.", { message: err?.message }, 500);
  }
}

export async function GET() {
  try {
    const items = await prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        slug: true,
        groomName: true,
        brideName: true,
        createdAt: true,
        updatedAt: true
      },
    });
    return ok(items);
  } catch (err: any) {
    return bad("Server error", { message: err?.message }, 500);
  }
}
