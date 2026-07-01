'use server'

import { cookies } from "next/headers"
import { API_URL } from "@/src/lib/utils"
import { redirect } from "next/navigation"
import type { UserProfile } from "@/src/types/profile"

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("AUTH_TOKEN")?.value ?? null
}

export async function getProfile(): Promise<UserProfile | null> {
  const token = await getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function updateFilters(
  femaleOnly: boolean,
  verifiedOnly: boolean
): Promise<{ ok?: boolean; error?: string }> {
  const token = await getAuthToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/profile/me/preferences`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ femaleOnly, verifiedOnly }),
    })
    if (res.status === 403) {
      const msg = await res.text().catch(() => "")
      return { error: msg || "You can't enable this filter." }
    }
    if (!res.ok) return { error: "Could not save preference" }
    return { ok: true }
  } catch {
    return { error: "Could not connect to server" }
  }
}

export async function updateProfile(formData: FormData): Promise<{ error?: string } | void> {
  const token = await getAuthToken()
  if (!token) return { error: "Not authenticated" }

  const interestsRaw = formData.getAll("interests") as string[]

  const body = {
    firstName: formData.get("firstName") || null,
    lastName: formData.get("lastName") || null,
    phone: formData.get("phone") || null,
    dateOfBirth: formData.get("dateOfBirth") || null,
    gender: formData.get("gender") || null,
    nationality: formData.get("nationality") || null,
    countryOfResidence: formData.get("countryOfResidence") || null,
    cityOfResidence: formData.get("cityOfResidence") || null,
    preferredLanguage: formData.get("preferredLanguage") || null,
    profilePictureUrl: formData.get("profilePictureUrl") || null,
    bio: formData.get("bio") || null,
    interests: interestsRaw.filter(Boolean),
    visitedPlaces: formData.getAll("visitedPlaces") as string[],
    bucketListPlaces: formData.getAll("bucketListPlaces") as string[],
    preferredTravelType: formData.get("preferredTravelType") || null,
    preferredClimate: formData.get("preferredClimate") || null,
    preferredTransport: formData.get("preferredTransport") || null,
    preferredAccommodation: formData.get("preferredAccommodation") || null,
    budgetRange: formData.get("budgetRange") || null,
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/profile/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) return { error: "Failed to update profile" }
  } catch {
    return { error: "Could not connect to server" }
  }

  redirect("/profile")
}
