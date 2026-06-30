"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts"

const COLORS = [
  "#0891b2", "#7c3aed", "#0d9488", "#d97706", "#db2777",
  "#2563eb", "#c026d3", "#16a34a", "#ea580c", "#4f46e5",
]

function toArray(data: Record<string, number>) {
  return Object.entries(data).map(([name, value]) => ({ name, value }))
}

function Empty() {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
      No data yet
    </div>
  )
}

export function BarDistribution({ data }: { data: Record<string, number> }) {
  const arr = toArray(data)
  if (arr.every((d) => d.value === 0) || arr.length === 0) return <Empty />
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={arr} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={54} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {arr.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DonutDistribution({ data }: { data: Record<string, number> }) {
  const arr = toArray(data)
  if (arr.length === 0) return <Empty />
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={arr} dataKey="value" nameKey="name" innerRadius={45} outerRadius={82} paddingAngle={2}>
          {arr.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
