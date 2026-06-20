'use server'

import { cookies } from "next/headers"
import { API_URL } from "@/lib/utils"

export async function getProfile() {
  const cookieStore = await cookies()
  const token = cookieStore.get("AUTH_TOKEN")

  console.log("AUTH_TOKEN exists:", !!token)
  console.log("AUTH_TOKEN value:", token?.value?.substring(0, 20) + "...")

  if (!token) return null

  try {
    const res = await fetch(`${API_URL}/api/v1/profile/me`, {
      headers: {
        Cookie: `AUTH_TOKEN=${token.value}`,
      },
      cache: "no-store",
    })

    console.log("Profile API status:", res.status)

    if (!res.ok) return null
    return res.json()
  } catch (e) {
    console.error("getProfile error:", e)
    return null
  }
}

