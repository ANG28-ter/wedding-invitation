import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";

export function generateAdminToken() {
  return crypto.randomBytes(32).toString("hex");
}

// ✅ hanya untuk cek (read-only)
export async function isAdminAuthenticated() {
  const cookieStore = await cookies(); // Next 16: Promise
  return Boolean(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}
