import { cookies } from "next/headers"

export interface CurrentUser {
  userId: string
  role: string
}

/**
 * Reads the AUTH_TOKEN cookie and decodes the JWT payload for UI gating only.
 * (Real authorization is enforced at the gateway — this is not verification.)
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get("AUTH_TOKEN")?.value
  if (!token) return null
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"))
    return { userId: payload.sub as string, role: (payload.role as string) ?? "USER" }
  } catch {
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  return (await getCurrentUser())?.role === "ADMIN"
}
