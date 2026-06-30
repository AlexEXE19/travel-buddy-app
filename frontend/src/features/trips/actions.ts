'use server'

import { cookies } from "next/headers"
import { API_URL } from "@/src/lib/utils"
import { createTripApiSchema, type CreateTripApiPayload } from "@/src/lib/schemas/trips"
import type { Trip, TripStatus, DiscoverTrip } from "@/src/types/trips"

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("AUTH_TOKEN")?.value ?? null
}

export async function getCreatedTrips(): Promise<Trip[] | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/trips/me/created`, {
      headers: { Cookie: `AUTH_TOKEN=${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getJoinedTrips(): Promise<Trip[] | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/trips/me/joined`, {
      headers: { Cookie: `AUTH_TOKEN=${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/trips/${tripId}`, {
      headers: { Cookie: `AUTH_TOKEN=${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function createTrip(payload: CreateTripApiPayload): Promise<{ ok?: boolean; error?: string }> {
  const token = await getAuthToken()
  if (!token) return { error: "Not authenticated" }

  const result = createTripApiSchema.safeParse(payload)
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid trip data" }
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/trips/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `AUTH_TOKEN=${token}`,
      },
      body: JSON.stringify(result.data),
    })
    if (res.status === 401) return { error: "Not authenticated" }
    if (res.status === 429) {
      const msg = await res.text().catch(() => "")
      return { error: msg || "Weekly trip limit reached. Upgrade to Premium for unlimited trips." }
    }
    if (res.status === 400) return { error: "Trip data was rejected by server" }
    if (!res.ok) return { error: "Failed to create trip" }
    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}

export async function updateTripStatus(tripId: string, status: TripStatus): Promise<{ ok?: boolean; error?: string }> {
  const token = await getAuthToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/trips/${tripId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `AUTH_TOKEN=${token}`,
      },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) return { error: "Failed to update status" }
    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}

export async function leaveTripAction(tripId: string): Promise<{ ok?: boolean; error?: string }> {
  const token = await getAuthToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/trips/${tripId}/leave`, {
      method: "DELETE",
      headers: { Cookie: `AUTH_TOKEN=${token}` },
    })
    if (!res.ok) return { error: "Failed to leave trip" }
    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}

export async function joinTripAction(tripId: string): Promise<{ ok?: boolean; error?: string }> {
  const token = await getAuthToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/trips/${tripId}/join`, {
      method: "POST",
      headers: { Cookie: `AUTH_TOKEN=${token}` },
    })
    if (res.status === 400) {
      const text = await res.text()
      return { error: text || "Cannot join this trip" }
    }
    if (!res.ok) return { error: "Failed to join trip" }
    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}

export async function getOpenTrips(): Promise<Trip[] | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/trips/open`, {
      headers: { Cookie: `AUTH_TOKEN=${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getDiscoverUsers(limit = 10): Promise<import("@/src/types/profile").UserDiscoverCard[] | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/matching/discover/users?limit=${limit}`, {
      headers: { Cookie: `AUTH_TOKEN=${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getDiscoverTrips(limit = 10): Promise<DiscoverTrip[] | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/matching/discover?limit=${limit}`, {
      headers: { Cookie: `AUTH_TOKEN=${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
