"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { ChevronLeft, ChevronRight, MapPin, CalendarDays } from "lucide-react"
import { cn } from "@/src/lib/utils"
import type { Trip } from "@/src/types/trips"

const TYPE_COLOR: Record<string, string> = {
  HIKING: "bg-emerald-500", CITY_BREAK: "bg-blue-500", BEACH: "bg-cyan-500",
  CULTURAL: "bg-amber-500", ADVENTURE: "bg-rose-500", OTHER: "bg-slate-500",
}
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"]

type CalTrip = { id: string; title: string; type: string; date: Date; role: "created" | "joined" }

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function CalendarView({ created, joined }: { created: Trip[]; joined: Trip[] }) {
  const trips: CalTrip[] = useMemo(() => {
    const build = (list: Trip[], role: "created" | "joined") =>
      list
        .filter((t) => t.itinerary?.startDateTime)
        .map((t) => ({ id: t.id, title: t.title, type: t.tripType, role, date: new Date(t.itinerary!.startDateTime as string) }))
    return [...build(created, "created"), ...build(joined, "joined")]
  }, [created, joined])

  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const byDay = useMemo(() => {
    const m = new Map<string, CalTrip[]>()
    for (const t of trips) {
      const k = dateKey(t.date)
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(t)
    }
    return m
  }, [trips])

  // Build the month grid (Monday-first)
  const firstOfMonth = new Date(view.year, view.month, 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7 // 0 = Monday
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.year, view.month, d))
  while (cells.length % 7 !== 0) cells.push(null)

  const monthTrips = trips
    .filter((t) => t.date.getFullYear() === view.year && t.date.getMonth() === view.month)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  function shift(delta: number) {
    setView((v) => {
      const m = v.month + delta
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Trip calendar</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your created and joined trips, by start date.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="w-40 text-center text-sm font-semibold">{MONTHS[view.month]} {view.year}</span>
            <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setView({ year: today.getFullYear(), month: today.getMonth() })}>
              Today
            </Button>
          </div>
        </div>

        {/* Month grid */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-medium text-muted-foreground">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              const isToday = date && dateKey(date) === dateKey(today)
              const dayTrips = date ? byDay.get(dateKey(date)) ?? [] : []
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[90px] border-b border-r border-border/60 p-1.5",
                    !date && "bg-muted/20",
                    i % 7 === 6 && "border-r-0"
                  )}
                >
                  {date && (
                    <>
                      <div className={cn(
                        "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        isToday ? "bg-gradient-to-br from-primary to-accent font-bold text-white" : "text-muted-foreground"
                      )}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayTrips.slice(0, 3).map((t) => (
                          <Link
                            key={t.id}
                            href="/trips"
                            className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] font-medium text-white"
                            title={`${t.title} (${t.role})`}
                          >
                            <span className={cn("inline-block h-3 w-full truncate rounded px-1", TYPE_COLOR[t.type] ?? "bg-slate-500")}>
                              {t.title}
                            </span>
                          </Link>
                        ))}
                        {dayTrips.length > 3 && (
                          <p className="px-1 text-[10px] text-muted-foreground">+{dayTrips.length - 3} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* This month's list */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">This month</h2>
          {monthTrips.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
              No trips in {MONTHS[view.month]}. Join one from the <Link href="/map" className="text-primary hover:underline">map</Link>.
            </p>
          ) : (
            <div className="space-y-2">
              {monthTrips.map((t) => (
                <Link key={t.id + t.role} href="/trips" className="card-hover flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-white", TYPE_COLOR[t.type] ?? "bg-slate-500")}>
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{t.title}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {t.date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    t.role === "created" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  )}>
                    {t.role === "created" ? "Created" : "Joined"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
