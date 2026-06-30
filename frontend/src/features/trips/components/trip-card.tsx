"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { CalendarDays, MapPin, Users } from "lucide-react"
import { tripStatusLabels, tripStatusStyles, type TripStatus } from "@/src/features/trips/constants/trip-statuses"
import { toggleCreatorStatus, formatTripDate } from "@/src/features/profile/utils"
import type { Trip } from "@/src/types/trips"

const tripTypeGradients: Record<string, string> = {
  HIKING: "from-emerald-600 to-teal-500",
  CITY_BREAK: "from-blue-600 to-indigo-500",
  BEACH: "from-cyan-500 to-sky-400",
  CULTURAL: "from-amber-600 to-orange-500",
  ADVENTURE: "from-rose-600 to-red-500",
  OTHER: "from-slate-600 to-slate-500",
}

const tripTypeLabels: Record<string, string> = {
  HIKING: "Hiking",
  CITY_BREAK: "City break",
  BEACH: "Beach",
  CULTURAL: "Cultural",
  ADVENTURE: "Adventure",
  OTHER: "Other",
}

interface TripCardProps {
  trip: Trip
  variant: "created" | "joined"
  onOpen: (trip: Trip) => void
  onStatusChange?: (tripId: string, status: TripStatus) => void
  onLeave?: (tripId: string) => void
}

export function TripCard({ trip, variant, onOpen, onStatusChange, onLeave }: TripCardProps) {
  const gradient = tripTypeGradients[trip.tripType] ?? "from-slate-600 to-slate-500"
  const memberCount = trip.members.length + 1 // +1 for creator

  return (
    <Card className="card-hover tint-card overflow-hidden pt-0">
      <button type="button" onClick={() => onOpen(trip)} className="group block w-full text-left">
        {/* Colored type banner instead of image */}
        <div className={`relative h-24 bg-gradient-to-br ${gradient} flex items-end p-4`}>
          <Badge className={`border ${tripStatusStyles[trip.status]}`}>
            {tripStatusLabels[trip.status]}
          </Badge>
          <span className="absolute top-3 right-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {tripTypeLabels[trip.tripType] ?? trip.tripType}
          </span>
          {trip.womenOnly && (
            <span className="absolute top-3 left-3 rounded-full bg-white/25 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              ♀ Women only
            </span>
          )}
        </div>

        <CardContent className="flex flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground leading-tight">{trip.title}</h3>
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Users className="inline h-3 w-3 mr-1" />
              {memberCount}/{trip.maxCapacity}
            </span>
          </div>

          {trip.itinerary && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {trip.itinerary.startLocationName}
              {trip.itinerary.stops.length > 0 && ` +${trip.itinerary.stops.length} stop${trip.itinerary.stops.length > 1 ? "s" : ""}`}
            </p>
          )}

          {trip.itinerary?.startDateTime && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              {formatTripDate(trip.itinerary.startDateTime)}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1">
            {variant === "created"
              ? "Click to review route and manage status."
              : "Click to review route or leave."}
          </p>
        </CardContent>
      </button>

      <div className="flex flex-wrap gap-2 border-t px-5 py-3">
        {variant === "created" ? (
          <>
            <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => onOpen(trip)}>
              View details
            </Button>
            {(trip.status === "OPEN" || trip.status === "CANCELLED") && (
              <Button
                type="button"
                size="sm"
                variant={trip.status === "OPEN" ? "destructive" : "default"}
                className="flex-1"
                onClick={() => onStatusChange?.(trip.id, toggleCreatorStatus(trip.status))}
              >
                {trip.status === "OPEN" ? "Cancel" : "Reopen"}
              </Button>
            )}
            {(trip.status === "FILLED" || trip.status === "COMPLETED") && (
              <Button type="button" size="sm" variant="outline" className="flex-1" disabled>
                {tripStatusLabels[trip.status]}
              </Button>
            )}
          </>
        ) : (
          <>
            <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => onOpen(trip)}>
              View details
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onLeave?.(trip.id)}
              disabled={trip.status === "CANCELLED" || trip.status === "COMPLETED"}
            >
              Leave
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
