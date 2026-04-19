import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-constants";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { email, password } = body ?? {};
    const inputEmail = String(email ?? "")
      .trim()
      .toLowerCase();
    const adminEmail = String(process.env.ADMIN_EMAIL ?? "")
      .trim()
      .toLowerCase();

    if (!adminEmail) {
      return NextResponse.json(
        { ok: false, message: "ADMIN_EMAIL belum diset." },
        { status: 500 }
      );
    }

    if (inputEmail !== adminEmail) {
      return NextResponse.json(
        { ok: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { ok: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      return NextResponse.json(
        { ok: false, message: "ADMIN_PASSWORD_HASH belum diset." },
        { status: 500 }
      );
    }

    const okPass = bcrypt.compareSync(String(password ?? ""), hash);

    const res = NextResponse.json({ ok: true });

    // ✅ set cookie disini (bukan lewat cookies())
    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    console.error("ADMIN LOGIN ERROR", err);
    return NextResponse.json(
      { ok: false, message: "Terjadi error server." },
      { status: 500 }
    );
  }
}
