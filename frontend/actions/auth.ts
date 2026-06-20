'use server'

import { redirect } from "next/navigation"
import { API_URL } from "@/lib/utils"
import { cookies } from "next/headers"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Missing required fields" }
  }

  let res: Response

  try {
    res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return { error: "Could not connect to authentication service." }
  }

  if (res.status === 401) return { error: "Invalid credentials!" }
  if (res.status === 400) return { error: "Bad request!" }
  if (!res.ok) return { error: "An error has occurred, try again later!" }

  const cookieHeader = res.headers.get("set-cookie")

  if (cookieHeader) {
    const tokenMatch = cookieHeader.match(/AUTH_TOKEN\s*=\s*([^;]+)/i)

    if (tokenMatch && tokenMatch[1]) {
      const cookieStore = await cookies()
      cookieStore.set({
        name: "AUTH_TOKEN",
        value: tokenMatch[1].trim(),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      })
    }
  }

  redirect("/profile")
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!email || !password || !confirmPassword) {
    return { error: "Missing required fields" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  let res: Response

  try {
    res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

  } catch {
    return { error: "Could not connect to authentication service." }
  }

  if (res.status === 409) return { error: "Email already in use!" }
  if (!res.ok) return { error: "An error has occurred, try again later!"}

  const cookieHeader = res.headers.get("set-cookie")

  if (cookieHeader) {
    const tokenMatch = cookieHeader.match(/AUTH_TOKEN\s*=\s*([^;]+)/i)

    if (tokenMatch && tokenMatch[1]) {
      const cookieStore = await cookies()
      cookieStore.set({
        name: "AUTH_TOKEN",
        value: tokenMatch[1].trim(),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      })
    }
  }

  redirect("/profile/edit")
}