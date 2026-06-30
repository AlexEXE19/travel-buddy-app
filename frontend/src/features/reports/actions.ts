"use server"

import { cookies } from "next/headers"
import { API_URL } from "@/src/lib/utils"

async function authToken(): Promise<string | null> {
  return (await cookies()).get("AUTH_TOKEN")?.value ?? null
}

export async function createReport(
  reportedUserId: string,
  reasons: string[],
  details: string | null
): Promise<{ ok?: boolean; error?: string }> {
  const token = await authToken()
  if (!token) return { error: "Not authenticated" }
  if (reasons.length === 0) return { error: "Select at least one reason" }
  try {
    const res = await fetch(`${API_URL}/api/v1/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `AUTH_TOKEN=${token}` },
      body: JSON.stringify({ reportedUserId, reasons, details }),
    })
    if (!res.ok) return { error: "Could not submit report" }
    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}
