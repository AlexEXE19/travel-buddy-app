"use client"

import { useState, useTransition } from "react"
import { Button } from "@/src/components/ui/button"
import { BadgeCheck, ShieldX, User } from "lucide-react"
import { setUserVerified } from "@/src/features/admin/actions"
import type { AdminProfile } from "@/src/types/admin"
import { cn } from "@/src/lib/utils"

export function VerificationGrid({ initial }: { initial: AdminProfile[] }) {
  // Unverified first, so they're easy to action.
  const [profiles, setProfiles] = useState(
    [...initial].sort((a, b) => Number(a.verified) - Number(b.verified))
  )
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function toggle(userId: string, verified: boolean) {
    setPendingId(userId)
    startTransition(async () => {
      const res = await setUserVerified(userId, verified)
      if (res.ok) {
        setProfiles((prev) => prev.map((p) => (p.userId === userId ? { ...p, verified } : p)))
      }
      setPendingId(null)
    })
  }

  if (profiles.length === 0) {
    return <p className="text-sm text-muted-foreground">No profiles.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map((p) => {
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || "Unnamed"
        return (
          <div
            key={p.userId}
            className={cn(
              "tint-card overflow-hidden rounded-2xl border",
              p.verified ? "border-border" : "border-amber-300/60",
              pendingId === p.userId && "opacity-50"
            )}
          >
            {/* Picture to inspect */}
            <div className="relative h-44 bg-muted">
              {p.profilePictureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.profilePictureUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <User className="h-10 w-10" />
                </div>
              )}
              <span
                className={cn(
                  "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  p.verified
                    ? "bg-sky-500/90 text-white"
                    : "bg-amber-500/90 text-white"
                )}
              >
                {p.verified ? <BadgeCheck className="h-3 w-3" /> : <ShieldX className="h-3 w-3" />}
                {p.verified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="space-y-2 p-4">
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">
                {[p.gender, p.nationality].filter(Boolean).join(" · ") || "—"}
              </p>
              {p.bio && <p className="line-clamp-2 text-sm text-muted-foreground">{p.bio}</p>}

              {p.verified ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => toggle(p.userId, false)}
                >
                  <ShieldX className="h-4 w-4" /> Revoke verification
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-sky-500 to-primary"
                  onClick={() => toggle(p.userId, true)}
                >
                  <BadgeCheck className="h-4 w-4" /> Verify profile
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
