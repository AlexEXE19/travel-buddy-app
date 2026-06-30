"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { X, Heart, Sparkles, MapPin, Compass, Plane, CalendarDays } from "lucide-react"
import { formatEnum, formatTripDate } from "@/src/features/profile/utils"
import { swipeUser } from "@/src/features/chat/actions"
import { ReportDialog } from "@/src/features/reports/components/report-dialog"
import { VerifiedBadge } from "@/src/components/verified-badge"
import type { UserDiscoverCard } from "@/src/types/profile"

function getInitials(firstName: string | null, lastName: string | null) {
  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || "?"
}

function getAvatarColor(userId: string) {
  const colors = ["#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626", "#2563eb", "#c026d3"]
  return colors[userId.charCodeAt(0) % colors.length]
}

function getAge(dateOfBirth: string | null): string {
  if (!dateOfBirth) return ""
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
  return age > 0 ? `, ${age}` : ""
}

interface SwipeViewProps {
  initialUsers: UserDiscoverCard[]
}

export function SwipeView({ initialUsers }: SwipeViewProps) {
  const [users] = useState(initialUsers)
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<"connected" | null>(null)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [limit, setLimit] = useState<string | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const passOpacity = useTransform(x, [-100, -20], [1, 0])

  const total = users.length

  async function handleAction(action: "LIKE" | "PASS") {
    const user = users[index]
    if (!user || limit) {
      x.set(0)
      return
    }
    const res = await swipeUser(user.userId, action)
    if (res.limited) {
      setLimit(res.error ?? "Daily swipe limit reached.")
      x.set(0)
      return
    }
    setDirection(action === "LIKE" ? "right" : "left")
    if (action === "LIKE") setFeedback("connected")
    setTimeout(() => {
      setFeedback(null)
      setDirection(null)
      setIndex(i => i + 1)
    }, action === "LIKE" ? 600 : 400)
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > 100) handleAction("LIKE")
    else if (info.offset.x < -100) handleAction("PASS")
    else x.set(0)
  }

  if (total === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-4 max-w-sm text-center">
        <Sparkles className="h-10 w-10 text-muted-foreground opacity-40" />
        <h1 className="text-2xl font-bold">No travelers found</h1>
        <p className="text-muted-foreground text-sm">
          Complete your profile so the matching engine can find travelers for you.
        </p>
      </div>
    )
  }

  if (index >= total) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-4 max-w-sm text-center">
        <Sparkles className="h-10 w-10 text-primary opacity-60" />
        <h1 className="text-2xl font-bold">All caught up!</h1>
        <p className="text-muted-foreground text-sm">
          You reviewed all {total} suggestions. Check back later.
        </p>
        <Button variant="outline" onClick={() => setIndex(0)}>Start over</Button>
      </div>
    )
  }

  const user = users[index]
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Traveler"

  return (
    <div className="relative mx-auto flex max-w-sm flex-col items-center gap-4 px-4 py-6">
      <div className="pointer-events-none absolute -top-10 -left-20 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-10 -right-20 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float-slow" />
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold gradient-text">Discover travelers</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {index + 1} of {total} · swipe or use the buttons
        </p>
      </div>

      {feedback === "connected" && (
        <div className="w-full rounded-xl px-4 py-2 text-sm font-medium text-center bg-emerald-500/10 text-emerald-700 border border-emerald-200 animate-fade-up">
          💚 Connection request sent!
        </div>
      )}

      {limit && (
        <div className="w-full rounded-xl border border-amber-200 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-700 animate-fade-up">
          🚦 {limit}{" "}
          <Link href="/premium" className="font-semibold underline">Go Premium</Link>
        </div>
      )}

      <div className="relative w-full" style={{ height: 600 }}>
        {/* Peek of the next card for depth */}
        {users[index + 1] && (
          <div className="absolute inset-x-3 top-3 bottom-0 -z-10 rounded-3xl border border-border bg-card/60 scale-[0.97]" />
        )}

        {/* Like / Pass stamps */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-6 z-20 border-4 border-emerald-500 text-emerald-500 font-black text-3xl px-4 py-1.5 rounded-xl rotate-[-14deg] pointer-events-none"
        >
          CONNECT
        </motion.div>
        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute top-8 right-6 z-20 border-4 border-destructive text-destructive font-black text-3xl px-4 py-1.5 rounded-xl rotate-[14deg] pointer-events-none"
        >
          PASS
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={user.userId}
            style={{ x, rotate }}
            drag={limit ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={
              direction === "right"
                ? { x: 500, opacity: 0 }
                : direction === "left"
                ? { x: -500, opacity: 0 }
                : { x: 0, opacity: 1 }
            }
            transition={{ duration: 0.35 }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <div className="w-full h-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex flex-col">
              {/* Photo hero with name overlaid */}
              <div className="relative h-72 shrink-0">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div
                    className="h-full w-full flex items-center justify-center text-white text-6xl font-bold"
                    style={{ background: `linear-gradient(135deg, ${getAvatarColor(user.userId)}, #7c3aed)` }}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                {user.openTrips?.length > 0 && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                    <Plane className="h-3 w-3" /> {user.openTrips.length} open trip{user.openTrips.length > 1 ? "s" : ""}
                  </span>
                )}
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <h2 className="flex items-center gap-1.5 text-2xl font-bold drop-shadow-sm">
                    {displayName}
                    {user.verified && <VerifiedBadge className="h-5 w-5 text-sky-300" />}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {user.nationality && (
                      <span className="flex items-center gap-1 text-sm text-white/90">
                        <MapPin className="h-3.5 w-3.5" /> {user.nationality}
                      </span>
                    )}
                    {user.preferredTravelType && (
                      <Badge className="gap-1 border-0 bg-white/20 text-white backdrop-blur text-xs">
                        <Compass className="h-3 w-3" />
                        {formatEnum(user.preferredTravelType)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
                {user.bio && (
                  <p className="text-sm text-foreground/80 leading-relaxed">{user.bio}</p>
                )}

                {user.interests?.length > 0 && (
                  <Section label="Interests">
                    {[...new Set(user.interests)].map(i => (
                      <span key={i} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {i}
                      </span>
                    ))}
                  </Section>
                )}

                {user.visitedPlaces?.length > 0 && (
                  <Section label="Been to">
                    {[...new Set(user.visitedPlaces)].map(p => (
                      <span key={p} className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">
                        📍 {p}
                      </span>
                    ))}
                  </Section>
                )}

                {user.bucketListPlaces?.length > 0 && (
                  <Section label="Bucket list">
                    {[...new Set(user.bucketListPlaces)].map(p => (
                      <span key={p} className="rounded-full bg-amber-500/10 text-amber-700 px-2.5 py-1 text-xs">
                        ⭐ {p}
                      </span>
                    ))}
                  </Section>
                )}

                {/* Open trips this traveler is hosting */}
                {user.openTrips?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <Plane className="h-3 w-3" /> Open trips you could join
                    </p>
                    <div className="space-y-2">
                      {user.openTrips.map(trip => (
                        <div
                          key={trip.id}
                          className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-3"
                        >
                          <p className="text-sm font-semibold text-foreground">{trip.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {trip.tripType && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                {formatEnum(trip.tripType)}
                              </span>
                            )}
                            {trip.startLocationName && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {trip.startLocationName}
                              </span>
                            )}
                            {trip.startDateTime && (
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" /> {formatTripDate(trip.startDateTime)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-8">
        <Button
          size="icon"
          variant="outline"
          onClick={() => handleAction("PASS")}
          disabled={!!limit}
          className="h-16 w-16 rounded-full border-2 bg-card shadow-md transition-transform hover:scale-110 hover:border-destructive hover:text-destructive disabled:opacity-50"
          aria-label="Pass"
        >
          <X className="h-7 w-7" />
        </Button>
        <Button
          size="icon"
          onClick={() => handleAction("LIKE")}
          disabled={!!limit}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 transition-transform hover:scale-110 disabled:opacity-50"
          aria-label="Connect"
        >
          <Heart className="h-7 w-7" />
        </Button>
      </div>

      {/* Report entry point (outside the draggable card) */}
      <ReportDialog reportedUserId={user.userId} reportedName={displayName} />
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
