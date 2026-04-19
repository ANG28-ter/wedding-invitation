import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-constants";

export async function POST() {
  const res = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"), {
    status: 303,
  });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
