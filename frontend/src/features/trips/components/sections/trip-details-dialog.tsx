"use client"

import dynamic from "next/dynamic"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { CalendarDays, MapPin, Route, Users } from "lucide-react"
import {
  tripStatusLabels,
  tripStatusStyles,
  type TripStatus,
} from "@/src/features/trips/constants/trip-statuses"
import { formatTripDate } from "@/src/features/profile/utils"
import type { Trip } from "@/src/types/trips"

const TripMap = dynamic(
  () => import("@/src/features/trips/components/trip-map").then((m) => m.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] rounded-2xl border bg-muted/30 flex items-center justify-center text-muted-foreground text-sm">
        Loading map…
      </div>
    ),
  }
)

interface TripDetailsDialogProps {
  selectedTrip: Trip | null
  variant: "created" | "joined"
  onClose: () => void
  onStatusChange: (tripId: string, status: TripStatus) => void
  onLeave: (tripId: string) => void
}

const tripTypeLabels: Record<string, string> = {
  HIKING: "Hiking",
  CITY_BREAK: "City break",
  BEACH: "Beach",
  CULTURAL: "Cultural",
  ADVENTURE: "Adventure",
  OTHER: "Other",
}

export function TripDetailsDialog({ selectedTrip, variant, onClose, onStatusChange, onLeave }: TripDetailsDialogProps) {
  const allowedStatuses: TripStatus[] = variant === "created" ? ["OPEN", "CANCELLED"] : []

  return (
    <Dialog open={Boolean(selectedTrip)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl overflow-hidden p-0">
        {selectedTrip && (
          <div className="max-h-[90vh] overflow-y-auto">
            <div className="space-y-6 p-6">
              {/* Header badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`border ${tripStatusStyles[selectedTrip.status]}`}>
                  {tripStatusLabels[selectedTrip.status]}
                </Badge>
                <Badge variant="secondary">
                  {variant === "created" ? "Your trip" : "Joined trip"}
                </Badge>
                <Badge variant="secondary">
                  {tripTypeLabels[selectedTrip.tripType] ?? selectedTrip.tripType}
                </Badge>
              </div>

              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl">{selectedTrip.title}</DialogTitle>
                {selectedTrip.description && (
                  <DialogDescription>{selectedTrip.description}</DialogDescription>
                )}
              </DialogHeader>

              {/* Info cards row */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm">Start date</span>
                  </div>
                  <p className="font-medium">{formatTripDate(selectedTrip.itinerary?.startDateTime)}</p>
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm">End date</span>
                  </div>
                  <p className="font-medium">{formatTripDate(selectedTrip.itinerary?.endDateTime)}</p>
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Capacity</span>
                  </div>
                  <p className="font-medium">
                    {selectedTrip.members.length + 1}/{selectedTrip.maxCapacity}
                  </p>
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <Route className="h-4 w-4" />
                    <span className="text-sm">Type</span>
                  </div>
                  <p className="font-medium">{tripTypeLabels[selectedTrip.tripType] ?? selectedTrip.tripType}</p>
                </div>
              </div>

              {/* Map — shown only when itinerary has coordinates */}
              {selectedTrip.itinerary && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">Route</h3>
                      <span className="text-sm text-muted-foreground">
                        Starting from {selectedTrip.itinerary.startLocationName}
                        {selectedTrip.itinerary.stops.length > 0 &&
                          ` · ${selectedTrip.itinerary.stops.length} stop${selectedTrip.itinerary.stops.length > 1 ? "s" : ""}`}
                      </span>
                    </div>
                    <TripMap
                      itinerary={selectedTrip.itinerary}
                      creatorId={selectedTrip.creatorId}
                      members={selectedTrip.members}
                      maxCapacity={selectedTrip.maxCapacity}
                    />
                  </div>
                </>
              )}

              {/* Stops list */}
              {selectedTrip.itinerary && selectedTrip.itinerary.stops.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold">Stops</h3>
                    <div className="space-y-2">
                      {[...selectedTrip.itinerary.stops]
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((stop, i) => (
                          <div key={stop.id} className="rounded-xl border p-3">
                            <p className="font-medium text-sm">
                              Stop {i + 1}: {stop.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Status management */}
              <div className="space-y-3 rounded-2xl border bg-muted/20 p-4">
                <div>
                  <h3 className="font-semibold">Trip status</h3>
                  <p className="text-sm text-muted-foreground">
                    {variant === "created"
                      ? "As the creator, you can open or cancel this trip."
                      : "You can leave the trip at any time while it is open."}
                  </p>
                </div>

                {variant === "created" ? (
                  <div className="flex flex-wrap gap-2">
                    {allowedStatuses.map((status) => (
                      <Button
                        key={status}
                        type="button"
                        variant={selectedTrip.status === status ? "default" : "outline"}
                        onClick={() => onStatusChange(selectedTrip.id, status)}
                      >
                        {tripStatusLabels[status]}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Keep trip
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => onLeave(selectedTrip.id)}
                      disabled={selectedTrip.status === "CANCELLED" || selectedTrip.status === "COMPLETED"}
                    >
                      Leave trip
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter className="sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {variant === "created"
                    ? "Manage the trip from here without leaving the overview."
                    : "This view shows the route before you decide to stay or leave."}
                </p>
                <Button type="button" onClick={onClose}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
