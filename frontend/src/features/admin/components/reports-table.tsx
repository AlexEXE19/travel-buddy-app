"use client"

import { useState, useTransition } from "react"
import { Badge } from "@/src/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { updateReport } from "@/src/features/admin/actions"
import type { Report, ReportStatus, AccountStatus } from "@/src/types/admin"
import { REPORT_REASONS } from "@/src/types/admin"
import { cn } from "@/src/lib/utils"

type Person = { firstName: string | null; lastName: string | null }

const REPORT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-700 border-amber-200",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-700 border-blue-200",
  RESOLVED: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  DISMISSED: "bg-zinc-500/10 text-zinc-600 border-zinc-200",
}
const ACCT_STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  SUSPENDED: "bg-amber-500/10 text-amber-700 border-amber-200",
  BANNED: "bg-red-500/10 text-red-700 border-red-200",
}

const reasonLabel = (code: string) =>
  REPORT_REASONS.find((r) => r.code === code)?.label ?? code

function name(id: string, people: Record<string, Person>) {
  const p = people[id]
  const full = p ? [p.firstName, p.lastName].filter(Boolean).join(" ") : ""
  return full || id.slice(0, 8)
}

export function ReportsTable({
  initialReports,
  people,
}: {
  initialReports: Report[]
  people: Record<string, Person>
}) {
  const [reports, setReports] = useState(initialReports)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function apply(
    id: string,
    patch: { status?: ReportStatus; reportedAccountStatus?: AccountStatus },
    optimistic: Partial<Report>
  ) {
    setPendingId(id)
    startTransition(async () => {
      const res = await updateReport(id, patch)
      if (res.ok) {
        setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...optimistic } : r)))
      }
      setPendingId(null)
    })
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No reports filed. 🎉
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div
          key={r.id}
          className={cn(
            "tint-card rounded-xl border border-border p-4",
            pendingId === r.id && "opacity-50"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">{name(r.reportedUserId, people)}</span>
                <Badge className={cn("border text-[10px]", ACCT_STATUS_STYLES[r.reportedAccountStatus ?? "ACTIVE"])}>
                  {r.reportedAccountStatus ?? "ACTIVE"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  reported by {name(r.reporterId, people)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.reasons.map((reason) => (
                  <span key={reason} className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                    {reasonLabel(reason)}
                  </span>
                ))}
              </div>
              {r.details && <p className="max-w-xl text-sm text-muted-foreground">“{r.details}”</p>}
              {r.adminNote && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Admin note:</span> {r.adminNote}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge className={cn("border text-xs", REPORT_STATUS_STYLES[r.status])}>{r.status}</Badge>

              <Select
                value={r.status}
                onValueChange={(v) => apply(r.id, { status: v as ReportStatus }, { status: v as ReportStatus })}
              >
                <SelectTrigger className="h-8 w-[160px]">
                  <SelectValue placeholder="Report status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under review</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={r.reportedAccountStatus ?? "ACTIVE"}
                onValueChange={(v) =>
                  apply(
                    r.id,
                    { reportedAccountStatus: v as AccountStatus },
                    { reportedAccountStatus: v as AccountStatus }
                  )
                }
              >
                <SelectTrigger className="h-8 w-[160px]">
                  <SelectValue placeholder="Account action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Keep active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspend user</SelectItem>
                  <SelectItem value="BANNED">Ban user</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
