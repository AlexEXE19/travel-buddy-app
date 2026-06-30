"use client"

import type { Trip } from "@/src/types/trips"
import { TripCard } from "@/src/features/trips/components/trip-card"

interface JoinedTripsSectionProps {
  trips: Trip[]
  onOpenTrip: (trip: Trip) => void
  onLeaveTrip: (tripId: string) => void
}

export function JoinedTripsSection({ trips, onOpenTrip, onLeaveTrip }: JoinedTripsSectionProps) {
  return (
    <section className="rounded-3xl border border-emerald-500/15 bg-emerald-500/5 p-5 md:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Trips you joined</h2>
          <p className="text-sm text-muted-foreground">Review the route or leave without affecting the trip for everyone else.</p>
        </div>
        <span className="rounded-full bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm">
          {trips.length} trip{trips.length !== 1 ? "s" : ""}
        </span>
      </div>

      {trips.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">You have not joined any trips yet. Discover trips in the Discover tab.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              variant="joined"
              onOpen={onOpenTrip}
              onLeave={onLeaveTrip}
            />
          ))}
        </div>
      )}
    </section>
  )
}
