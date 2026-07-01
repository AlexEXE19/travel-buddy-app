"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { API_URL } from "@/src/lib/utils"

export type AdminLoginState = { error?: string }

export async function adminLogin(
  _prev: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  if (!email || !password) return { error: "Enter your email and password." }

  let res: Response
  try {
    res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return { error: "Could not connect to the server." }
  }

  if (!res.ok) return { error: "Invalid email or password." }

  // The auth-service returns the JWT via a Set-Cookie header (not the body).
  const cookieHeader = res.headers.get("set-cookie")
  const token = cookieHeader?.match(/AUTH_TOKEN\s*=\s*([^;]+)/i)?.[1]?.trim()
  if (!token) return { error: "Login failed." }

  let role = "USER"
  try {
    role = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8")).role ?? "USER"
  } catch {
    /* ignore */
  }
  if (role !== "ADMIN") {
    return { error: "This account does not have administrator access." }
  }

  ;(await cookies()).set({
    name: "AUTH_TOKEN",
    value: token,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  })

  redirect("/admin")
}
