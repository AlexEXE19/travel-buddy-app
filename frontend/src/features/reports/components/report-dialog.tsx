"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Flag } from "lucide-react"
import { REPORT_REASONS } from "@/src/types/admin"
import { createReport } from "@/src/features/reports/actions"

interface ReportDialogProps {
  reportedUserId: string
  reportedName?: string
  trigger?: React.ReactNode
}

export function ReportDialog({ reportedUserId, reportedName, trigger }: ReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [details, setDetails] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const otherChecked = selected.includes("OTHER")

  function toggle(code: string) {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  async function submit() {
    setError(null)
    if (selected.length === 0) {
      setError("Please select at least one reason.")
      return
    }
    if (otherChecked && !details.trim()) {
      setError("Please describe the issue for ‘Other’.")
      return
    }
    setLoading(true)
    const res = await createReport(reportedUserId, selected, details.trim() || null)
    setLoading(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setDone(true)
    setTimeout(() => {
      setOpen(false)
      setDone(false)
      setSelected([])
      setDetails("")
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            <Flag className="h-4 w-4" /> Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {reportedName ?? "this user"}</DialogTitle>
          <DialogDescription>
            Tell us what’s wrong. An admin will review your report. Reports are confidential.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center text-sm font-medium text-emerald-600">
            ✅ Report submitted. Thank you for keeping the community safe.
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2.5">
              {REPORT_REASONS.map((r) => (
                <label key={r.code} className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox
                    checked={selected.includes(r.code)}
                    onCheckedChange={() => toggle(r.code)}
                  />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>

            {otherChecked && (
              <div className="space-y-1.5">
                <Label htmlFor="report-details" className="text-xs">
                  Describe the issue
                </Label>
                <Textarea
                  id="report-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Add any details that help us understand…"
                  rows={3}
                  maxLength={2000}
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        {!done && (
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submit} disabled={loading}>
              {loading ? "Submitting…" : "Submit report"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
