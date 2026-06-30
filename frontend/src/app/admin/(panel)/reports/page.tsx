import { getReports } from "@/src/features/admin/actions"
import { getProfilesByIds } from "@/src/features/chat/actions"
import { ReportsTable } from "@/src/features/admin/components/reports-table"

export default async function AdminReportsPage() {
  const reports = (await getReports()) ?? []

  // Resolve reporter + reported names for a friendlier table.
  const ids = Array.from(
    new Set(reports.flatMap((r) => [r.reporterId, r.reportedUserId]))
  )
  const profiles = ids.length > 0 ? await getProfilesByIds(ids) : []
  const people = Object.fromEntries(
    profiles.map((p) => [p.userId, { firstName: p.firstName, lastName: p.lastName }])
  )

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Reports</h2>
        <p className="text-sm text-muted-foreground">
          Review user reports. Set a report status and, if needed, suspend or ban the reported user.
        </p>
      </div>
      <ReportsTable initialReports={reports} people={people} />
    </div>
  )
}
