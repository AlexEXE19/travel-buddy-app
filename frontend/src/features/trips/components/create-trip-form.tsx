"use client"

import { useState } from "react"
import { createTrip } from "../actions"
import { Button } from "@/src/components/ui/button"
import { CardContent, CardFooter } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Checkbox } from "@/src/components/ui/checkbox"
import { tripTypeOptions } from "@/src/features/trips/constants/travel-types"
import type { LocationSuggestion as TripLocationSuggestion } from "@/src/lib/schemas/trips"
import { LocationAutocompleteField } from "./location-autocomplete-field"
import { DurationFields } from "./duration-fields"
import { Plus, Route, Trash2, Users } from "lucide-react"
import { capacityOptions, monthOptions, MAX_STOPS } from "@/src/features/trips/constants/trip-form"
import type { TripTypeValue } from "@/src/features/trips/constants/travel-types"
import type { CreateTripApiPayload } from "@/src/lib/schemas/trips"

interface StopDraft {
  id: string
  location: TripLocationSuggestion | null
  durationAmount: string
  durationUnit: "hours" | "days"
}

function createStopDraft(): StopDraft {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    location: null,
    durationAmount: "",
    durationUnit: "hours",
  }
}

function buildDateValue(day: string, month: string, year: string): string | null {
  if (!day || !month || !year) return null
  const d = Number(day), m = Number(month), y = Number(year)
  if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 1 || m > 12 || y < 2024) return null
  const date = new Date(Date.UTC(y, m - 1, d))
  if (date.getUTCDate() !== d || date.getUTCMonth() !== m - 1 || date.getUTCFullYear() !== y) return null
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function DatePartsField({ day, month, year, onDayChange, onMonthChange, onYearChange }: {
  day: string; month: string; year: string
  onDayChange: (v: string) => void; onMonthChange: (v: string) => void; onYearChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>Start date *</Label>
      <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)_110px]">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Day</Label>
          <Input value={day} onChange={(e) => onDayChange(e.target.value)} inputMode="numeric" placeholder="12" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Month</Label>
          <Select value={month} onValueChange={onMonthChange}>
            <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
            <SelectContent>
              {monthOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Year</Label>
          <Input value={year} onChange={(e) => onYearChange(e.target.value)} inputMode="numeric" placeholder="2026" />
        </div>
      </div>
    </div>
  )
}

export function CreateTripForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tripType, setTripType] = useState<TripTypeValue>("HIKING")
  const [startPoint, setStartPoint] = useState<TripLocationSuggestion | null>(null)
  const [destination, setDestination] = useState<TripLocationSuggestion | null>(null)
  const [startDay, setStartDay] = useState("")
  const [startMonth, setStartMonth] = useState("")
  const [startYear, setStartYear] = useState("")
  const [destinationDurationAmount, setDestinationDurationAmount] = useState("")
  const [destinationDurationUnit, setDestinationDurationUnit] = useState<"hours" | "days">("hours")
  const [stops, setStops] = useState<StopDraft[]>([])
  const [womenOnly, setWomenOnly] = useState(false)

  function addStop(afterIndex: number) {
    setStops((cur) => {
      if (cur.length >= MAX_STOPS) return cur
      const next = [...cur]
      next.splice(afterIndex + 1, 0, createStopDraft())
      return next
    })
  }

  function updateStop(index: number, patch: Partial<StopDraft>) {
    setStops((cur) => cur.map((s, i) => i === index ? { ...s, ...patch } : s))
  }

  function removeStop(index: number) {
    setStops((cur) => cur.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim() || undefined
    const maxCapacity = Number(formData.get("maxCapacity"))
    const startDate = buildDateValue(startDay, startMonth, startYear)

    if (!title) { setError("Title is required"); setIsLoading(false); return }
    if (!startDate) { setError("Valid start date is required"); setIsLoading(false); return }
    if (!startPoint) { setError("Select a starting point"); setIsLoading(false); return }
    if (!destination) { setError("Select a destination"); setIsLoading(false); return }

    // Build itinerary stops: intermediate stops first (in order), then destination as last stop
    let intermediateStops
    try {
      intermediateStops = stops.map((s, i) => {
        if (!s.location) throw new Error(`Select a location for stop ${i + 1}`)
        return { name: s.location.label, latitude: s.location.lat, longitude: s.location.lng, orderIndex: i }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid stop data")
      setIsLoading(false)
      return
    }

    const destinationStop = {
      name: destination.label,
      latitude: destination.lat,
      longitude: destination.lng,
      orderIndex: stops.length,
    }

    const allStops = [...intermediateStops, destinationStop]

    const payload: CreateTripApiPayload = {
      title,
      description,
      tripType,
      maxCapacity,
      womenOnly,
      itinerary: {
        startDateTime: `${startDate}T00:00:00Z`,
        startLocationName: startPoint.label,
        startLat: startPoint.lat,
        startLng: startPoint.lng,
        stops: allStops,
      },
    }

    try {
      const result = await createTrip(payload)
      if (result?.error) { setError(result.error); setIsLoading(false); return }
      window.location.href = "/trips"
    } catch {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Trip title *</Label>
            <Input id="title" name="title" placeholder="Barcelona and beyond" required maxLength={100} />
          </div>
          <DatePartsField
            day={startDay} month={startMonth} year={startYear}
            onDayChange={setStartDay} onMonthChange={setStartMonth} onYearChange={setStartYear}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="What is this trip about? Who is it for?" rows={3} maxLength={1000} className="resize-none" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Max travelers *</Label>
            <Select name="maxCapacity" defaultValue="2">
              <SelectTrigger id="maxCapacity" className="w-full">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                {capacityOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} travelers</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex cursor-pointer items-center gap-2 pt-1">
              <Checkbox checked={womenOnly} onCheckedChange={(v) => setWomenOnly(Boolean(v))} />
              <span className="text-sm text-muted-foreground">♀ Women-only trip (only women can join)</span>
            </label>
          </div>

          <div className="space-y-2">
            <Label>Trip type *</Label>
            <div className="grid grid-cols-3 gap-2">
              {tripTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTripType(opt.value)}
                  className={`rounded-xl border px-3 py-2 text-sm transition-colors text-left ${
                    tripType === opt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Route className="h-4 w-4 text-primary" />
            Route
          </div>

          <div className="rounded-xl border p-4 sm:p-5 space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Starting point *</p>
            <LocationAutocompleteField
              label="Starting point"
              placeholder="Search a city, airport or landmark"
              description="Pick from recommendations so coordinates are stored."
              required
              value={startPoint}
              onChange={setStartPoint}
            />
          </div>

          <div className="rounded-xl border p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Destination *</p>
              <Button type="button" variant="outline" size="sm" onClick={() => addStop(-1)} disabled={stops.length >= MAX_STOPS}>
                <Plus className="h-3 w-3" /> Add stop before
              </Button>
            </div>
            <LocationAutocompleteField
              label="Destination"
              placeholder="Where is the main destination?"
              description="This will be the final stop on the route."
              required
              value={destination}
              onChange={setDestination}
            />
            <DurationFields
              amount={destinationDurationAmount}
              unit={destinationDurationUnit}
              onAmountChange={setDestinationDurationAmount}
              onUnitChange={setDestinationDurationUnit}
            />
          </div>

          {stops.map((stop, index) => (
            <div key={stop.id} className="rounded-xl border p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Stop {index + 1}</p>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeStop(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addStop(index)} disabled={stops.length >= MAX_STOPS}>
                    <Plus className="h-3 w-3" /> After
                  </Button>
                </div>
              </div>
              <LocationAutocompleteField
                label={`Stop ${index + 1}`}
                placeholder="Search for this stop"
                description=""
                required
                value={stop.location}
                onChange={(v) => updateStop(index, { location: v })}
              />
              <DurationFields
                amount={stop.durationAmount}
                unit={stop.durationUnit}
                onAmountChange={(v) => updateStop(index, { durationAmount: v })}
                onUnitChange={(v) => updateStop(index, { durationUnit: v })}
              />
            </div>
          ))}

          {stops.length === 0 && (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground text-center">
              No intermediate stops. Add one if the route passes through other places.
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>

      <CardFooter className="border-t pt-6">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? "Creating trip…" : "Create trip"}
        </Button>
      </CardFooter>
    </form>
  )
}
