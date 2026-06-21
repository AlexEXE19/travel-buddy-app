"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, MapPin, Plus, Route, Users } from "lucide-react"
import {
  tripStatusLabels,
  tripStatusOptions,
  tripStatusStyles,
  type TripStatus,
} from "@/data/trip-statuses"
import { createdTrips as createdTripsSeed, joinedTrips as joinedTripsSeed, type TripRecord } from "@/data/trips-showcase"

function getNextStatus(status: TripStatus) {
  const index = tripStatusOptions.indexOf(status)
  return tripStatusOptions[(index + 1) % tripStatusOptions.length]
}

function formatLocation(label: string, lat: number, lng: number) {
  return `${label} (${lat.toFixed(4)}, ${lng.toFixed(4)})`
}

function getDurationLabel(durationAmount: number | null, durationUnit: "hours" | "days" | null) {
  if (!durationAmount || !durationUnit) return "No duration set"

  return `${durationAmount} ${durationUnit}`
}

export default function TripsPage() {
  const [createdTrips, setCreatedTrips] = useState(createdTripsSeed)
  const [joinedTrips, setJoinedTrips] = useState(joinedTripsSeed)
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null)

  function updateTripStatus(tripId: string, status: TripStatus) {
    setCreatedTrips((currentTrips) => currentTrips.map((trip) => (trip.id === tripId ? { ...trip, status } : trip)))
    setJoinedTrips((currentTrips) => currentTrips.map((trip) => (trip.id === tripId ? { ...trip, status } : trip)))

    setSelectedTrip((currentTrip) => (currentTrip?.id === tripId ? { ...currentTrip, status } : currentTrip))
  }

  function leaveTrip(tripId: string) {
    setJoinedTrips((currentTrips) => currentTrips.filter((trip) => trip.id !== tripId))

    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-3 rounded-3xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trips</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of what you created, what you joined, and the current status of each route.
            </p>
          </div>
          <Button asChild>
            <Link href="/trips/create">
              <Plus className="h-4 w-4" />
              Create trip
            </Link>
          </Button>
        </div>

        <section className="rounded-3xl border border-primary/15 bg-primary/5 p-5 md:p-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Trips you created</h2>
              <p className="text-sm text-muted-foreground">Manage trip status, route details and participant flow.</p>
            </div>
            <span className="rounded-full bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm">
              {createdTrips.length} trips
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {createdTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                variant="created"
                onOpen={setSelectedTrip}
                onStatusChange={updateTripStatus}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/15 bg-emerald-500/5 p-5 md:p-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Trips you joined</h2>
              <p className="text-sm text-muted-foreground">Review the route or leave without affecting the trip for everyone else.</p>
            </div>
            <span className="rounded-full bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm">
              {joinedTrips.length} trips
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {joinedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                variant="joined"
                onOpen={setSelectedTrip}
                onLeave={leaveTrip}
              />
            ))}
          </div>
        </section>
      </div>

      <Dialog open={Boolean(selectedTrip)} onOpenChange={(open) => !open && setSelectedTrip(null)}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          {selectedTrip && (
            <div className="max-h-[85vh] overflow-y-auto">
              <div className="relative aspect-[16/7]">
                <Image
                  src={selectedTrip.image || "/placeholder.svg"}
                  alt={selectedTrip.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3 text-white">
                  <Badge className={`border ${tripStatusStyles[selectedTrip.status]}`}>
                    {tripStatusLabels[selectedTrip.status]}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/10">
                    {selectedTrip.owner === "created" ? "Your trip" : "Joined trip"}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/10">
                    {selectedTrip.style}
                  </Badge>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-2xl">{selectedTrip.title}</DialogTitle>
                  <DialogDescription>{selectedTrip.description}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCard label="Dates" value={selectedTrip.dates} icon={<CalendarDays className="h-4 w-4" />} />
                  <InfoCard label="Capacity" value={`${selectedTrip.members}/${selectedTrip.capacity}`} icon={<Users className="h-4 w-4" />} />
                  <InfoCard label="Trip style" value={selectedTrip.style} icon={<Route className="h-4 w-4" />} />
                  <InfoCard label="Start date" value={selectedTrip.startDate} icon={<CalendarDays className="h-4 w-4" />} />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <DetailBlock
                    label="Starting point"
                    value={formatLocation(selectedTrip.startPoint.label, selectedTrip.startPoint.lat, selectedTrip.startPoint.lng)}
                  />
                  <DetailBlock
                    label="Destination"
                    value={formatLocation(
                      selectedTrip.destinationLocation.location.label,
                      selectedTrip.destinationLocation.location.lat,
                      selectedTrip.destinationLocation.location.lng,
                    )}
                    meta={`Time spent: ${getDurationLabel(
                      selectedTrip.destinationLocation.durationAmount,
                      selectedTrip.destinationLocation.durationUnit,
                    )}`}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">Stops</h3>
                    </div>
                    {selectedTrip.stops.length > 0 ? (
                      <div className="space-y-3">
                        {selectedTrip.stops.map((stop, index) => (
                          <div key={stop.location.id} className="rounded-xl border p-4">
                            <p className="font-medium">
                              Stop {index + 1}: {stop.location.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatLocation(stop.location.label, stop.location.lat, stop.location.lng)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Time spent: {getDurationLabel(stop.durationAmount, stop.durationUnit)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No extra stops on this route.</p>
                    )}
                  </div>

                  <div className="space-y-4 rounded-2xl border bg-muted/20 p-4">
                    <div>
                      <h3 className="font-semibold">People</h3>
                      <p className="text-sm text-muted-foreground">Creator and participants for this trip.</p>
                    </div>

                    <PeopleCard person={selectedTrip.creator} highlight />

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Participants</p>
                      <div className="space-y-3">
                        {selectedTrip.participants.map((person) => (
                          <PeopleCard key={person.id} person={person} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border bg-muted/20 p-4">
                  <div>
                    <h3 className="font-semibold">Trip status</h3>
                    <p className="text-sm text-muted-foreground">
                      Open means people can join, filled means the trip reached capacity, cancelled stops it,
                      and completed closes it out.
                    </p>
                  </div>

                  {selectedTrip.owner === "created" ? (
                    <div className="flex flex-wrap gap-2">
                      {tripStatusOptions.map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant={selectedTrip.status === status ? "default" : "outline"}
                          onClick={() => updateTripStatus(selectedTrip.id, status)}
                        >
                          {tripStatusLabels[status]}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={() => setSelectedTrip(null)}>
                        Keep trip
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => leaveTrip(selectedTrip.id)}
                        disabled={selectedTrip.status === "cancelled" || selectedTrip.status === "completed"}
                      >
                        Leave trip
                      </Button>
                    </div>
                  )}
                </div>

                <DialogFooter className="sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedTrip.owner === "created"
                      ? "You can manage the trip from here without leaving the overview page."
                      : "This view shows the route before you decide to stay or leave."}
                  </p>
                  <Button type="button" onClick={() => setSelectedTrip(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TripCard({
  trip,
  variant,
  onOpen,
  onStatusChange,
  onLeave,
}: {
  trip: TripRecord
  variant: "created" | "joined"
  onOpen: (trip: TripRecord) => void
  onStatusChange?: (tripId: string, status: TripStatus) => void
  onLeave?: (tripId: string) => void
}) {
  return (
    <Card className="overflow-hidden pt-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <button type="button" onClick={() => onOpen(trip)} className="group block w-full text-left">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={trip.image || "/placeholder.svg"}
            alt={trip.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
          <Badge className={`absolute top-3 right-3 border ${tripStatusStyles[trip.status]}`}>
            {tripStatusLabels[trip.status]}
          </Badge>
        </div>

        <CardContent className="flex flex-col gap-2 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{trip.title}</h3>
              <p className="text-sm text-muted-foreground">{trip.style}</p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {trip.members}/{trip.capacity}
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {trip.destination}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {trip.dates}
          </p>
          <p className="text-sm text-muted-foreground">
            {variant === "created"
              ? "Click to review the full route and manage status."
              : "Click to review the full route before you decide to stay or leave."}
          </p>
        </CardContent>
      </button>

      <div className="flex flex-wrap gap-2 border-t px-6 py-4">
        {variant === "created" ? (
          <>
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpen(trip)}>
              View details
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={() => onStatusChange?.(trip.id, getNextStatus(trip.status))}
            >
              Next status
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpen(trip)}>
              View details
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={() => onLeave?.(trip.id)}
              disabled={trip.status === "cancelled" || trip.status === "completed"}
            >
              Leave trip
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}

function PeopleCard({ person, highlight = false }: { person: TripRecord["creator"]; highlight?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-3 ${highlight ? "bg-background" : "bg-background/70"}`}>
      <Avatar className="h-12 w-12">
        <AvatarImage src={person.avatarUrl} alt={person.name} />
        <AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-foreground">{person.name}</p>
          {person.accent ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{person.accent}</span>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{person.role}</p>
        <p className="mt-1 text-sm text-muted-foreground">{person.bio}</p>
      </div>
    </div>
  )
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  )
}

function DetailBlock({
  label,
  value,
  meta,
}: {
  label: string
  value: string
  meta?: string
}) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
      {meta ? <p className="mt-2 text-sm text-muted-foreground">{meta}</p> : null}
    </div>
  )
}