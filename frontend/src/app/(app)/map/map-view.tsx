"use client"

import "leaflet/dist/leaflet.css"
import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"
import { formatTripDate } from "@/src/features/profile/utils"
import { joinTripAction } from "@/src/features/trips/actions"
import { Button } from "@/src/components/ui/button"
import { MapPin, CalendarDays, Users, Check, X, Plane } from "lucide-react"
import type { Trip } from "@/src/types/trips"

const tripTypeLabels: Record<string, string> = {
  HIKING: "Hiking", CITY_BREAK: "City break", BEACH: "Beach",
  CULTURAL: "Cultural", ADVENTURE: "Adventure", OTHER: "Other",
}

const tripTypeColors: Record<string, string> = {
  HIKING: "#059669", CITY_BREAK: "#2563eb", BEACH: "#0891b2",
  CULTURAL: "#d97706", ADVENTURE: "#dc2626", OTHER: "#64748b",
}

function makeTripIcon(tripType: string, mine: boolean, selected: boolean): L.DivIcon {
  const color = mine ? "#f59e0b" : tripTypeColors[tripType] ?? "#64748b"
  const size = selected ? 44 : mine ? 40 : 32
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:${size / 2.2}px;font-weight:700;
      border:3px solid #fff;
      box-shadow:0 2px 10px rgba(0,0,0,${mine ? 0.45 : 0.3});
      ${selected ? "outline:4px solid rgba(8,145,178,0.5);outline-offset:1px;" : mine ? "outline:3px solid rgba(245,158,11,0.35);outline-offset:1px;" : ""}
    ">${mine ? "★" : "✈"}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

interface MapViewProps {
  initialTrips: Trip[]
  myUserId: string | null
}

export function MapView({ initialTrips, myUserId }: MapViewProps) {
  const initialized = useRef(false)
  if (!initialized.current) {
    fixLeafletIcons()
    initialized.current = true
  }
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [joinedIds, setJoinedIds] = useState<Set<string>>(
    () => new Set(myUserId ? initialTrips.filter((t) => t.members.includes(myUserId)).map((t) => t.id) : [])
  )
  const [feedback, setFeedback] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const mappableTrips = initialTrips.filter(
    (t) => t.itinerary && t.itinerary.startLat != null && t.itinerary.startLng != null
  )
  const selected = mappableTrips.find((t) => t.id === selectedId) ?? null

  function join(trip: Trip) {
    setFeedback(null)
    startTransition(async () => {
      const res = await joinTripAction(trip.id)
      if (res.ok) {
        setJoinedIds((prev) => new Set(prev).add(trip.id))
        setFeedback("Joined! It's now in your Trips.")
        router.refresh()
      } else {
        setFeedback(res.error || "Could not join this trip.")
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">World map</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mappableTrips.length} open trip{mappableTrips.length !== 1 ? "s" : ""} you could join.
            Click a marker to see details and join.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Map */}
          <div className="relative h-[560px] flex-1 overflow-hidden rounded-2xl border border-border shadow-lg">
            <MapContainer center={[20, 10]} zoom={2} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mappableTrips.map((trip) => {
                const mine = myUserId != null && trip.creatorId === myUserId
                return (
                  <Marker
                    key={trip.id}
                    position={[trip.itinerary!.startLat, trip.itinerary!.startLng]}
                    icon={makeTripIcon(trip.tripType, mine, trip.id === selectedId)}
                    eventHandlers={{ click: () => { setSelectedId(trip.id); setFeedback(null) } }}
                  />
                )
              })}
            </MapContainer>
          </div>

          {/* Side panel */}
          <aside className="w-full shrink-0 lg:w-80">
            {selected ? (
              <TripPanel
                trip={selected}
                mine={myUserId != null && selected.creatorId === myUserId}
                joined={joinedIds.has(selected.id)}
                pending={pending}
                feedback={feedback}
                onClose={() => setSelectedId(null)}
                onJoin={() => join(selected)}
              />
            ) : (
              <div className="flex h-[560px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center">
                <Plane className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a trip on the map to see its details and join.
                </p>
              </div>
            )}
          </aside>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-amber-600">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white" style={{ background: "#f59e0b" }}>★</span>
            Your trips
          </span>
          {Object.entries(tripTypeColors).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
              {tripTypeLabels[type]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TripPanel({
  trip, mine, joined, pending, feedback, onClose, onJoin,
}: {
  trip: Trip
  mine: boolean
  joined: boolean
  pending: boolean
  feedback: string | null
  onClose: () => void
  onJoin: () => void
}) {
  const color = mine ? "#f59e0b" : tripTypeColors[trip.tripType] ?? "#64748b"
  const travelers = trip.members.length + 1
  const pct = Math.min(100, Math.round((travelers / trip.maxCapacity) * 100))
  const full = travelers >= trip.maxCapacity

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="relative p-4 text-white" style={{ background: `linear-gradient(135deg, ${color}, #7c3aed)` }}>
        <button onClick={onClose} className="absolute right-2 top-2 rounded-full bg-white/20 p-1 hover:bg-white/30" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-wrap items-center gap-1.5">
          {mine && <span className="text-[10px] font-bold uppercase tracking-wide opacity-95">★ Your trip</span>}
          {trip.womenOnly && (
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold">♀ Women only</span>
          )}
        </div>
        <h2 className="text-lg font-bold leading-tight">{trip.title}</h2>
        <p className="text-xs opacity-90">{tripTypeLabels[trip.tripType] ?? trip.tripType}</p>
      </div>

      <div className="space-y-3 p-4">
        {trip.itinerary?.startLocationName && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" /> {trip.itinerary.startLocationName}
          </p>
        )}
        {trip.itinerary?.startDateTime && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" /> {formatTripDate(trip.itinerary.startDateTime)}
          </p>
        )}
        {trip.description && <p className="text-sm text-foreground/80">{trip.description}</p>}

        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Travelers</span>
            <span>{travelers}/{trip.maxCapacity}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
          </div>
        </div>

        {feedback && (
          <p className={joined ? "text-sm font-medium text-emerald-600" : "text-sm text-destructive"}>{feedback}</p>
        )}

        {mine ? (
          <Button asChild variant="outline" className="w-full">
            <a href="/trips">Manage trip</a>
          </Button>
        ) : joined ? (
          <Button disabled className="w-full bg-emerald-500 hover:bg-emerald-500">
            <Check className="h-4 w-4" /> Joined
          </Button>
        ) : (
          <Button onClick={onJoin} disabled={pending || full} className="w-full bg-gradient-to-r from-primary to-accent">
            {pending ? "Joining…" : full ? "Trip is full" : "Join this trip"}
          </Button>
        )}
      </div>
    </div>
  )
}
