'use server'

import { cookies } from "next/headers"
import { API_URL } from "@/lib/utils"
import { createTripSchema, type CreateTripInput } from "@/lib/schemas/trips"

export async function getTrips() {
  const cookieStore = await cookies()
  const token = cookieStore.get("AUTH_TOKEN")


  if (!token) return null

  try {
    const res = await fetch(`${API_URL}/api/v1/trips/me`, {
      headers: {
        Cookie: `AUTH_TOKEN=${token.value}`,
      },
      cache: "no-store",
    })


    if (!res.ok) return null
    return res.json()
  } catch (e) {
    console.error("getTrips error:", e)
    return null
  }
}

export async function createTrip(payload: CreateTripInput) {
  const cookieStore = await cookies()
  const token = cookieStore.get("AUTH_TOKEN")

  if (!token) return { error: "Not authenticated" }

  const result = createTripSchema.safeParse(payload)

  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid trip data" }
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `AUTH_TOKEN=${token.value}`,
      },
      body: JSON.stringify(result.data),
    })

    if (res.status === 401) return { error: "Not authenticated" }
    if (res.status === 400) return { error: "Trip data was rejected" }
    if (!res.ok) return { error: "Failed to create trip" }

    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}

