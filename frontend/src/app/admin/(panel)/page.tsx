import { getOverview, getUserStats } from "@/src/features/admin/actions"
import { BarDistribution, DonutDistribution } from "@/src/features/admin/components/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Users, UserCheck, UserX, ShieldAlert, BadgeCheck } from "lucide-react"

function Stat({
  label,
  value,
  icon,
  tone = "primary",
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  tone?: "primary" | "amber" | "red" | "emerald"
}) {
  const tones: Record<string, string> = {
    primary: "from-primary/15 to-accent/15 text-primary",
    amber: "from-amber-500/15 to-amber-500/5 text-amber-600",
    red: "from-red-500/15 to-red-500/5 text-red-600",
    emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
  }
  return (
    <div className="tint-card flex items-center gap-3 rounded-xl border border-border p-4">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]}`}>
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function ChartCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Card className="tint-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default async function AdminOverviewPage() {
  const [overview, stats] = await Promise.all([getOverview(), getUserStats()])

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Total users" value={overview?.totalUsers ?? "—"} icon={<Users className="h-5 w-5" />} />
        <Stat label="Active" value={overview?.active ?? "—"} icon={<UserCheck className="h-5 w-5" />} tone="emerald" />
        <Stat label="Suspended" value={overview?.suspended ?? "—"} icon={<UserX className="h-5 w-5" />} tone="amber" />
        <Stat label="Banned" value={overview?.banned ?? "—"} icon={<UserX className="h-5 w-5" />} tone="red" />
        <Stat label="Pending reports" value={overview?.pendingReports ?? "—"} icon={<ShieldAlert className="h-5 w-5" />} tone="amber" />
      </div>

      {/* Audience analytics */}
      <div>
        <h2 className="text-sm font-semibold text-foreground">Audience analytics</h2>
        <p className="text-xs text-muted-foreground">
          Aggregate, anonymous demographics — the kind of insight useful for advertising partners.
          {stats && (
            <> {" "}<span className="inline-flex items-center gap-1 text-emerald-600"><BadgeCheck className="h-3 w-3" />{stats.verifiedUsers} verified</span></>
          )}
        </p>
      </div>

      {stats ? (
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="Preferred travel type">
            <BarDistribution data={stats.byTravelType} />
          </ChartCard>
          <ChartCard title="Age groups">
            <BarDistribution data={stats.byAgeGroup} />
          </ChartCard>
          <ChartCard title="Budget range">
            <DonutDistribution data={stats.byBudget} />
          </ChartCard>
          <ChartCard title="Gender">
            <DonutDistribution data={stats.byGender} />
          </ChartCard>
          <ChartCard title="Top nationalities">
            <BarDistribution data={stats.topNationalities} />
          </ChartCard>
          <ChartCard title="Top interests">
            <BarDistribution data={stats.topInterests} />
          </ChartCard>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Stats unavailable.</p>
      )}
    </div>
  )
}
