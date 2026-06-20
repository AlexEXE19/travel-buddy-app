'use server'

import { redirect } from "next/navigation"
import { API_URL } from "@/lib/utils"
import { cookies } from "next/headers"

export async function updateProfile(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string
  const dateOfBirth = formData.get("dateOfBirth") as string
  const gender = formData.get("gender") as string
  const nationality = formData.get("nationality") as string
  const countryOfResidence = formData.get("countryOfResidence") as string
  const cityOfResidence = formData.get("cityOfResidence") as string
  const preferredLanguage = formData.get("preferredLanguage") as string
  const budgetRaw = formData.get("budget") as string
  const profilePictureUrl = formData.get("profilePictureUrl") as string
  const bio = formData.get("bio") as string
  const subscriptionStatus = formData.get("subscriptionStatus") as string

  if (!firstName || !lastName) {
    return { error: "First name and last name are required fields" }
  }

  const budget = budgetRaw ? parseFloat(budgetRaw) : null

  const cookieStore = await cookies()
  const token = cookieStore.get("AUTH_TOKEN")?.value

  let res: Response

  try {
    res = await fetch(`${API_URL}/api/v1/profile/me`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        nationality: nationality || null,
        countryOfResidence: countryOfResidence || null,
        cityOfResidence: cityOfResidence || null,
        preferredLanguage: preferredLanguage || null,
        budget,
        profilePictureUrl: profilePictureUrl || null,
        bio: bio || null,
        subscriptionStatus
      }),
    })
  } catch {
    return { error: "Could not connect to profile service." }
  }

  if (res.status === 401) return { error: "Unauthorized access!" }
  if (res.status === 400) return { error: "Invalid profile data provided!" }
  if (!res.ok) return { error: "An error has occurred, try again later!" }

  redirect("/profile")
}