'use server'

import { cookies } from "next/headers"
import { API_URL } from "@/lib/utils"

export async function getProfile() {
  const cookieStore = await cookies()
  const token = cookieStore.get("AUTH_TOKEN")


  if (!token) return null

  try {
    const res = await fetch(`${API_URL}/api/v1/profile/me`, {
      headers: {
        Cookie: `AUTH_TOKEN=${token.value}`,
      },
      cache: "no-store",
    })


    if (!res.ok) return null
    return res.json()
  } catch (e) {
    console.error("getProfile error:", e)
    return null
  }
}

