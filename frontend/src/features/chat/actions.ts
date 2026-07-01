'use server'

import { cookies } from "next/headers"
import { API_URL } from "@/src/lib/utils"
import type { ChatRoom, ChatMessage, ChatParticipant } from "@/src/types/chat"

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("AUTH_TOKEN")?.value ?? null
}

export async function getChatRooms(): Promise<ChatRoom[] | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/chat/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function getRoomMessages(roomId: string): Promise<ChatMessage[] | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/chat/rooms/${roomId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function getMatches() {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/matching/matches`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function swipeUser(
  targetUserId: string,
  action: "LIKE" | "PASS"
): Promise<{ ok?: boolean; error?: string; limited?: boolean }> {
  const token = await getAuthToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/matching/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId, action }),
    })
    if (res.status === 429) {
      const msg = await res.text().catch(() => "")
      return { error: msg || "Daily swipe limit reached.", limited: true }
    }
    if (!res.ok) return { error: "Swipe failed" }
    return { ok: true }
  } catch { return { error: "Could not connect" } }
}

export async function getProfilesByIds(ids: string[]): Promise<ChatParticipant[]> {
  const token = await getAuthToken()
  if (!token || ids.length === 0) return []
  try {
    const res = await fetch(`${API_URL}/api/v1/profile/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ids),
      cache: "no-store",
    })
    if (!res.ok) return []
    const profiles = await res.json()
    return (profiles as Array<Record<string, unknown>>).map((p) => ({
      userId: (p.userId ?? p.id) as string,
      firstName: (p.firstName ?? null) as string | null,
      lastName: (p.lastName ?? null) as string | null,
      profilePictureUrl: (p.profilePictureUrl ?? null) as string | null,
    }))
  } catch {
    return []
  }
}

export async function getAuthTokenForClient(): Promise<string | null> {
  return getAuthToken()
}
