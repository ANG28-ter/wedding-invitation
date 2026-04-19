import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-constants";

function requireAdmin(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes(`${ADMIN_COOKIE_NAME}=`);
}

export async function GET(req: Request) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const items = await prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        groomName: true,
        brideName: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 200,
    });

    return NextResponse.json({ ok: true, data: items });
  } catch (err: any) {
    console.error("GET /api/admin/invitations error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Terjadi error di server.",
        details: { message: err?.message },
      },
      { status: 500 }
    );
  }
}
