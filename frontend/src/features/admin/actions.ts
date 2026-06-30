"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { API_URL } from "@/src/lib/utils"
import type {
  AdminOverview,
  AdminUser,
  AdminProfile,
  Report,
  UserStats,
  AccountStatus,
  ReportStatus,
} from "@/src/types/admin"

async function authToken(): Promise<string | null> {
  return (await cookies()).get("AUTH_TOKEN")?.value ?? null
}

async function adminGet<T>(path: string): Promise<T | null> {
  const token = await authToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Cookie: `AUTH_TOKEN=${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function getOverview(): Promise<AdminOverview | null> {
  return adminGet<AdminOverview>("/api/v1/admin/overview")
}

export async function getAdminUsers(status?: string): Promise<AdminUser[] | null> {
  const q = status ? `?status=${encodeURIComponent(status)}` : ""
  return adminGet<AdminUser[]>(`/api/v1/admin/users${q}`)
}

export async function getReports(status?: string): Promise<Report[] | null> {
  const q = status ? `?status=${encodeURIComponent(status)}` : ""
  return adminGet<Report[]>(`/api/v1/admin/reports${q}`)
}

export async function getUserStats(): Promise<UserStats | null> {
  return adminGet<UserStats>("/api/v1/profile/admin/stats")
}

export async function getAdminProfiles(): Promise<AdminProfile[] | null> {
  return adminGet<AdminProfile[]>("/api/v1/profile/admin/users")
}

export async function setUserVerified(
  userId: string,
  verified: boolean
): Promise<{ ok?: boolean; error?: string }> {
  const token = await authToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/profile/admin/users/${userId}/verified`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: `AUTH_TOKEN=${token}` },
      body: JSON.stringify({ verified }),
    })
    if (!res.ok) return { error: "Update failed" }
    revalidatePath("/admin/verification")
    return { ok: true }
  } catch {
    return { error: "Could not connect" }
  }
}

export async function setUserStatus(
  userId: string,
  accountStatus: AccountStatus
): Promise<{ ok?: boolean; error?: string }> {
  const token = await authToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: `AUTH_TOKEN=${token}` },
      body: JSON.stringify({ accountStatus }),
    })
    if (!res.ok) return { error: "Update failed" }
    revalidatePath("/admin/users")
    revalidatePath("/admin")
    return { ok: true }
  } catch {
    return { error: "Could not connect" }
  }
}

export async function updateReport(
  reportId: string,
  body: { status?: ReportStatus; adminNote?: string; reportedAccountStatus?: AccountStatus | null }
): Promise<{ ok?: boolean; error?: string }> {
  const token = await authToken()
  if (!token) return { error: "Not authenticated" }
  try {
    const res = await fetch(`${API_URL}/api/v1/admin/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: `AUTH_TOKEN=${token}` },
      body: JSON.stringify(body),
    })
    if (!res.ok) return { error: "Update failed" }
    revalidatePath("/admin/reports")
    revalidatePath("/admin")
    return { ok: true }
  } catch {
    return { error: "Could not connect" }
  }
}
