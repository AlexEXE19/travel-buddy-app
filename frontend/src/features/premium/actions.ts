"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { API_URL } from "@/src/lib/utils"

async function authToken(): Promise<string | null> {
  return (await cookies()).get("AUTH_TOKEN")?.value ?? null
}

/** Called after a successful (test) checkout — flips the profile to PREMIUM. */
export async function subscribePremium(): Promise<{ ok?: boolean; error?: string }> {
  const token = await authToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/profile/me/subscribe`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return { error: "Payment could not be processed" }
    revalidatePath("/premium")
    revalidatePath("/profile")
    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}

export async function cancelPremium(): Promise<{ ok?: boolean; error?: string }> {
  const token = await authToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/profile/me/cancel-subscription`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return { error: "Could not cancel" }
    revalidatePath("/premium")
    revalidatePath("/profile")
    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}
