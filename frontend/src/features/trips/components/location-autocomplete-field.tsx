"use client"

import { useState } from "react"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { MapPin, Search } from "lucide-react"
import { useLocationSuggestions, type LocationSuggestion as SearchSuggestion } from "@/src/hooks/use-location-suggestion"
import type { LocationSuggestion as TripLocationSuggestion } from "@/src/lib/schemas/trips"

function toTripLocationSuggestion(location: SearchSuggestion): TripLocationSuggestion {
  return {
    id: location.id,
    label: location.name,
    placeId: location.id,
    lat: Number(location.lat),
    lng: Number(location.lon),
  }
}

export function LocationAutocompleteField({
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
