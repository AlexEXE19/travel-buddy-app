'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { API_URL } from "@/lib/utils"

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get("AUTH_TOKEN")

  if (!token) return { error: "Not authenticated" }

  const body = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth") || null,
    gender: formData.get("gender"),
    nationality: formData.get("nationality"),
    countryOfResidence: formData.get("countryOfResidence"),
    cityOfResidence: formData.get("cityOfResidence"),
    preferredLanguage: formData.get("preferredLanguage"),
    budget: formData.get("budget") ? Number(formData.get("budget")) : null,
    profilePictureUrl: formData.get("profilePictureUrl"),
    bio: formData.get("bio"),
    subscriptionStatus: formData.get("subscriptionStatus"),
    interests: formData.getAll("interests").join(","),
    preferredTravelType: formData.getAll("preferredTravelType").join(","),
    preferredClimate: formData.get("preferredClimate"),
    preferredTransport: formData.get("preferredTransport"),
    preferredAccommodation: formData.get("preferredAccommodation")
  }

  try {
    const profileRes = await fetch(`${API_URL}/api/v1/profile/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `AUTH_TOKEN=${token.value}`,
      },
      body: JSON.stringify(body),
    })

    if (!profileRes.ok) return { error: "Failed to update profile" }

  } catch {
    return { error: "Could not connect to server" }
  }

  redirect("/profile")
}