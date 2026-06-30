"use client"

import type { Trip, TripStatus } from "@/src/types/trips"
import { TripCard } from "@/src/features/trips/components/trip-card"

interface CreatedTripsSectionProps {
  trips: Trip[]
  onOpenTrip: (trip: Trip) => void
  onStatusChange: (tripId: string, status: TripStatus) => void
}

export function CreatedTripsSection({ trips, onOpenTrip, onStatusChange }: CreatedTripsSectionProps) {
  return (
    <section className="rounded-3xl border border-primary/15 bg-primary/5 p-5 md:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Trips you created</h2>
          <p className="text-sm text-muted-foreground">Manage trip status, route details and participant flow.</p>
        </div>
        <span className="rounded-full bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm">
          {trips.length} trip{trips.length !== 1 ? "s" : ""}
        </span>
      </div>

      {trips.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">You have not created any trips yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              variant="created"
              onOpen={onOpenTrip}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  )
}
