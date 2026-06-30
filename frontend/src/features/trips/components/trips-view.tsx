"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useTripsManagement } from "@/src/features/profile/hooks/use-trips-management"
import { CreatedTripsSection } from "./sections/created-trips-section"
import { JoinedTripsSection } from "./sections/joined-trips-sections"
import { TripDetailsDialog } from "./sections/trip-details-dialog"
import type { Trip } from "@/src/types/trips"

interface TripsViewProps {
  initialCreated: Trip[]
  initialJoined: Trip[]
}

export function TripsView({ initialCreated, initialJoined }: TripsViewProps) {
  const {
    createdTrips,
    joinedTrips,
    selectedTrip,
    setSelectedTrip,
    updateTripStatus,
    leaveTrip,
  } = useTripsManagement(initialCreated, initialJoined)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="pointer-events-none absolute -top-12 -right-8 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="relative">
            <h1 className="text-2xl font-bold">Trips</h1>
            <p className="mt-1 text-sm text-primary-foreground/85">
              Keep track of what you created, what you joined, and the current status of each route.
            </p>
          </div>
          <Button asChild variant="secondary" className="relative shadow-sm">
            <Link href="/trips/create">
              <Plus className="h-4 w-4" />
              Create trip
            </Link>
          </Button>
        </div>

        <CreatedTripsSection
          trips={createdTrips}
          onOpenTrip={setSelectedTrip}
          onStatusChange={updateTripStatus}
        />

        <JoinedTripsSection
          trips={joinedTrips}
          onOpenTrip={setSelectedTrip}
          onLeaveTrip={leaveTrip}
        />
      </div>

      {selectedTrip && (
        <TripDetailsDialog
          selectedTrip={selectedTrip}
          variant={createdTrips.some((t) => t.id === selectedTrip.id) ? "created" : "joined"}
          onClose={() => setSelectedTrip(null)}
          onStatusChange={updateTripStatus}
          onLeave={leaveTrip}
        />
      )}
    </div>
  )
}
