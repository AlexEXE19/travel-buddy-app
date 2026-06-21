"use client"

import { useMemo, useState } from "react"
import { createTrip } from "@/actions/trips"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { travelTypeOptions, type TravelTypeValue } from "@/data/travel-types"
import type { CreateTripInput, LocationSuggestion as TripLocationSuggestion, RouteLocation } from "@/lib/schemas/trips"
import { useLocationSuggestions, type LocationSuggestion as SearchSuggestion } from "@/hooks/use-location-suggestion"
import { MapPin, Plus, Route, Search, Trash2, Users } from "lucide-react"

const capacityOptions = [2, 3, 4, 5]
const durationUnitOptions = [
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
]
const monthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]
const MAX_STOPS = 5

type StopDraft = {
  id: string
  location: TripLocationSuggestion | null
  durationAmount: string
  durationUnit: "hours" | "days"
}

type TripStyle = TravelTypeValue | "other"

function createStopDraft(): StopDraft {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    location: null,
    durationAmount: "",
    durationUnit: "hours",
  }
}

function toTripLocationSuggestion(location: SearchSuggestion): TripLocationSuggestion {
  return {
    id: location.id,
    label: location.name,
    placeId: location.id,
    lat: Number(location.lat),
    lng: Number(location.lon),
  }
}

function normalizeRouteLocation(
  location: TripLocationSuggestion | null,
  durationAmount: string,
  durationUnit: "hours" | "days",
): RouteLocation | null {
  if (!location) return null

  return {
    location,
    durationAmount: durationAmount.trim() ? Number(durationAmount) : null,
    durationUnit: durationAmount.trim() ? durationUnit : null,
  }
}

function buildDateValue(day: string, month: string, year: string) {
  if (!day || !month || !year) return null

  const parsedDay = Number(day)
  const parsedMonth = Number(month)
  const parsedYear = Number(year)

  if (
    Number.isNaN(parsedDay) ||
    Number.isNaN(parsedMonth) ||
    Number.isNaN(parsedYear) ||
    parsedDay < 1 ||
    parsedDay > 31 ||
    parsedMonth < 1 ||
    parsedMonth > 12 ||
    parsedYear < 2000
  ) {
    return null
  }

  const date = new Date(Date.UTC(parsedYear, parsedMonth - 1, parsedDay))

  if (
    date.getUTCFullYear() !== parsedYear ||
    date.getUTCMonth() !== parsedMonth - 1 ||
    date.getUTCDate() !== parsedDay
  ) {
    return null
  }

  return `${parsedYear}-${String(parsedMonth).padStart(2, "0")}-${String(parsedDay).padStart(2, "0")}`
}

function LocationAutocompleteField({
  label,
  placeholder,
  description,
  required,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  description?: string
  required?: boolean
  value: TripLocationSuggestion | null
  onChange: (value: TripLocationSuggestion | null) => void
}) {
  const [query, setQuery] = useState(value?.label || "")
  const [results, setResults] = useState<SearchSuggestion[]>([])

  useLocationSuggestions(query, setResults)

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? " *" : ""}
      </Label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          placeholder={placeholder}
          className="pl-9"
          onChange={(event) => {
            const nextValue = event.target.value
            setQuery(nextValue)

            if (value && nextValue !== value.label) {
              onChange(null)
            }
          }}
          required={required}
        />

        {query.trim().length >= 3 && results.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border bg-popover shadow-lg">
            <div className="max-h-72 overflow-auto p-1">
              {results.map((result) => {
                const nextLocation = toTripLocationSuggestion(result)

                return (
                  <button
                    key={result.id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onChange(nextLocation)
                      setQuery(nextLocation.label)
                      setResults([])
                    }}
                    className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex flex-col">
                      <span className="font-medium">{result.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {Number(result.lat).toFixed(4)}, {Number(result.lon).toFixed(4)}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {value ? (
        <p className="text-xs text-muted-foreground">
          Selected location: {value.label} ({value.lat.toFixed(4)}, {value.lng.toFixed(4)})
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Choose one result from the recommendations.</p>
      )}

      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

function DurationFields({
  amount,
  unit,
  onAmountChange,
  onUnitChange,
}: {
  amount: string
  unit: "hours" | "days"
  onAmountChange: (value: string) => void
  onUnitChange: (value: "hours" | "days") => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
      <div className="space-y-2">
        <Label>Time spent</Label>
        <Input
          type="number"
          min="1"
          placeholder="Optional"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Unit</Label>
        <Select value={unit} onValueChange={(value) => onUnitChange(value as "hours" | "days")}>
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {durationUnitOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function DatePartsField({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
}: {
  day: string
  month: string
  year: string
  onDayChange: (value: string) => void
  onMonthChange: (value: string) => void
  onYearChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>Start date *</Label>
      <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)_110px]">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Day</Label>
          <Input value={day} onChange={(event) => onDayChange(event.target.value)} inputMode="numeric" placeholder="12" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Month</Label>
          <Select value={month} onValueChange={onMonthChange}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Year</Label>
          <Input value={year} onChange={(event) => onYearChange(event.target.value)} inputMode="numeric" placeholder="2026" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Enter the date as day, month and year.</p>
    </div>
  )
}

export function CreateTripForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tripStyle, setTripStyle] = useState<TripStyle>("solo")
  const [otherTripStyle, setOtherTripStyle] = useState("")
  const [startPoint, setStartPoint] = useState<TripLocationSuggestion | null>(null)
  const [destination, setDestination] = useState<TripLocationSuggestion | null>(null)
  const [startDay, setStartDay] = useState("")
  const [startMonth, setStartMonth] = useState("")
  const [startYear, setStartYear] = useState("")
  const [destinationDurationAmount, setDestinationDurationAmount] = useState("")
  const [destinationDurationUnit, setDestinationDurationUnit] = useState<"hours" | "days">("hours")
  const [stops, setStops] = useState<StopDraft[]>([])

  const resolvedTripStyle = useMemo(
    () => (tripStyle === "other" ? otherTripStyle.trim() : tripStyle),
    [otherTripStyle, tripStyle],
  )

  function addStop(afterIndex: number) {
    setStops((currentStops) => {
      if (currentStops.length >= MAX_STOPS) return currentStops

      const nextStops = [...currentStops]
      nextStops.splice(afterIndex + 1, 0, createStopDraft())
      return nextStops
    })
  }

  function updateStop(index: number, nextStop: Partial<StopDraft>) {
    setStops((currentStops) =>
      currentStops.map((stop, currentIndex) =>
        currentIndex === index
          ? {
              ...stop,
              ...nextStop,
            }
          : stop,
      ),
    )
  }

  function removeStop(index: number) {
    setStops((currentStops) => currentStops.filter((_, currentIndex) => currentIndex !== index))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get("title") || "").trim()
    const capacity = Number(formData.get("capacity"))
    const startDate = buildDateValue(startDay, startMonth, startYear)

    if (!title || !startDate || Number.isNaN(capacity)) {
      setError("Title, start date and capacity are required")
      setIsLoading(false)
      return
    }

    if (!resolvedTripStyle) {
      setError("Select a trip style")
      setIsLoading(false)
      return
    }

    if (!startPoint) {
      setError("Select a starting point from the recommendations")
      setIsLoading(false)
      return
    }

    if (!destination) {
      setError("Select a destination from the recommendations")
      setIsLoading(false)
      return
    }

    const normalizedDestination = normalizeRouteLocation(
      destination,
      destinationDurationAmount,
      destinationDurationUnit,
    )

    if (!normalizedDestination) {
      setError("Select a destination")
      setIsLoading(false)
      return
    }

    const normalizedStops = stops.map((stop, index) => {
      if (!stop.location) {
        throw new Error(`Select a location for stop ${index + 1}`)
      }

      return normalizeRouteLocation(stop.location, stop.durationAmount, stop.durationUnit)
    })

    if (normalizedStops.some((stop) => !stop)) {
      setError("Select a location for every stop you add")
      setIsLoading(false)
      return
    }

    const payload: CreateTripInput = {
      title,
      startDate,
      capacity,
      tripStyle: resolvedTripStyle,
      tripStatus: "open",
      startPoint,
      destination: normalizedDestination,
      stops: normalizedStops as RouteLocation[],
    }

    const result = await createTrip(payload)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    window.location.href = "/trips"
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Trip title *</Label>
            <Input id="title" name="title" placeholder="Barcelona and beyond" required />
          </div>

          <DatePartsField
            day={startDay}
            month={startMonth}
            year={startYear}
            onDayChange={setStartDay}
            onMonthChange={setStartMonth}
            onYearChange={setStartYear}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity *</Label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Select name="capacity" defaultValue="2">
                <SelectTrigger id="capacity" className="w-full pl-9">
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  {capacityOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option} travelers
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border bg-muted/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Route overview</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Add a starting point, destination and up to 5 optional stops. Every chosen location stores coordinates and must come from the recommendation list.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border p-4 sm:p-5">
          <div className="space-y-1">
            <Label>Trip style *</Label>
            <p className="text-sm text-muted-foreground">
              Choose one style for this trip. If none of the presets fit, use Other.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {travelTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTripStyle(option.value)}
                className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                  tripStyle === option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
            <Select value={tripStyle} onValueChange={(value) => setTripStyle(value as TripStyle)}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {travelTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {tripStyle === "other" && (
              <Input
                value={otherTripStyle}
                onChange={(event) => setOtherTripStyle(event.target.value)}
                placeholder="Describe this trip style"
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starting point</p>
                <h3 className="text-base font-semibold text-foreground">Where the trip begins</h3>
              </div>
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                Required
              </span>
            </div>

            <LocationAutocompleteField
              label="Starting point"
              placeholder="Search a city, airport or landmark"
              description="Pick from the recommendations only so the place can be stored with coordinates."
              required
              value={startPoint}
              onChange={setStartPoint}
            />
          </div>

          <div className="rounded-xl border p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Destination</p>
                <h3 className="text-base font-semibold text-foreground">Primary trip destination</h3>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Main stop
              </span>
            </div>

            <div className="space-y-5">
              <LocationAutocompleteField
                label="Destination"
                placeholder="Search the destination"
                description="This destination is required and can also store optional time spent."
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

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addStop(-1)}
                  disabled={stops.length >= MAX_STOPS}
                >
                  <Plus className="h-4 w-4" />
                  Add stop after destination
                </Button>
              </div>
            </div>
          </div>

          {stops.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Stops</h3>
                  <p className="text-sm text-muted-foreground">
                    Optional stops between the destination and the end of the route.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stops.length}/{MAX_STOPS}
                </p>
              </div>

              <div className="space-y-4">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="rounded-xl border p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Stop {index + 1}</p>
                        <h3 className="text-base font-semibold text-foreground">Route stop</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStop(index)}
                          aria-label={`Remove stop ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          Optional
                        </span>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <LocationAutocompleteField
                        label={`Stop ${index + 1}`}
                        placeholder="Search the next stop"
                        description="Each stop can store its own coordinates and optional time spent."
                        required
                        value={stop.location}
                        onChange={(value) => updateStop(index, { location: value })}
                      />

                      <DurationFields
                        amount={stop.durationAmount}
                        unit={stop.durationUnit}
                        onAmountChange={(value) => updateStop(index, { durationAmount: value })}
                        onUnitChange={(value) => updateStop(index, { durationUnit: value })}
                      />

                      <div className="flex flex-wrap justify-between gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addStop(index)}
                          disabled={stops.length >= MAX_STOPS}
                        >
                          <Plus className="h-4 w-4" />
                          Add stop after this one
                        </Button>

                        <p className="text-xs text-muted-foreground">
                          Stops are ordered in the sequence the group will visit them.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stops.length === 0 && (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
              No extra stops yet. Add one if your route should include more destinations.
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          You can store coordinates for every selected location and optionally log how long the trip spends there.
        </p>
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? "Creating trip..." : "Create trip"}
        </Button>
      </CardFooter>
    </form>
  )
}