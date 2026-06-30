export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED"
export type ReportStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED"

export interface AdminUser {
  id: string
  email: string
  accountStatus: AccountStatus | null
  role: string | null
  createdAt: string
}

export interface Report {
  id: string
  reporterId: string
  reportedUserId: string
  reasons: string[]
  details: string | null
  status: ReportStatus
  adminNote: string | null
  reviewedBy: string | null
  reportedAccountStatus: AccountStatus | null
  createdAt: string
  updatedAt: string
}

export interface AdminProfile {
  userId: string
  firstName: string | null
  lastName: string | null
  profilePictureUrl: string | null
  gender: string | null
  nationality: string | null
  bio: string | null
  verified: boolean
}

export interface AdminOverview {
  totalUsers: number
  active: number
  suspended: number
  banned: number
  pendingReports: number
}

export interface UserStats {
  totalUsers: number
  verifiedUsers: number
  unverifiedUsers: number
  byGender: Record<string, number>
  byTravelType: Record<string, number>
  byBudget: Record<string, number>
  byClimate: Record<string, number>
  byAgeGroup: Record<string, number>
  topNationalities: Record<string, number>
  topInterests: Record<string, number>
}

/** The fixed set of report reasons shown as checkboxes. */
export const REPORT_REASONS: { code: string; label: string }[] = [
  { code: "HARASSMENT", label: "Harassment or bullying" },
  { code: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { code: "SPAM_OR_SCAM", label: "Spam or scam" },
  { code: "FAKE_PROFILE", label: "Fake profile / impersonation" },
  { code: "SAFETY_CONCERN", label: "Safety concern" },
  { code: "OTHER", label: "Other" },
]
