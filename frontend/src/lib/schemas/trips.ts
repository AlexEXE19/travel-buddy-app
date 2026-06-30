import { z } from "zod"

export const tripTypeValues = ["HIKING", "CITY_BREAK", "BEACH", "CULTURAL", "ADVENTURE", "OTHER"] as const
export type TripTypeValue = (typeof tripTypeValues)[number]

export const locationSuggestionSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  placeId: z.string().nullable().optional(),
  lat: z.number(),
  lng: z.number(),
})

export const routeLocationSchema = z.object({
  location: locationSuggestionSchema,
  durationAmount: z.number().int().positive().nullable().optional(),
  durationUnit: z.enum(["hours", "days"]).nullable().optional(),
})

// Internal form state schema (used by the form component for validation before mapping to API)
export const createTripFormSchema = z.object({
  title: z.string().min(1, "Trip title is required").max(100),
  description: z.string().max(1000).optional(),
  tripType: z.enum(tripTypeValues, { errorMap: () => ({ message: "Select a trip type" }) }),
  maxCapacity: z.number().int().min(2).max(5),
  startPoint: locationSuggestionSchema,
  destination: routeLocationSchema,
  stops: z.array(routeLocationSchema).max(5).default([]),
  startDay: z.string(),
  startMonth: z.string(),
  startYear: z.string(),
})

// API payload schema (what is actually sent to the backend)
export const createTripApiSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  tripType: z.enum(tripTypeValues),
  maxCapacity: z.number().int().min(2).max(5),
  womenOnly: z.boolean().default(false),
  itinerary: z.object({
    startDateTime: z.string(),
    startLocationName: z.string(),
    startLat: z.number(),
    startLng: z.number(),
    endDateTime: z.string().nullable().optional(),
    stops: z.array(z.object({
      name: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      orderIndex: z.number().int(),
      arrivalDateTime: z.string().nullable().optional(),
      departureDateTime: z.string().nullable().optional(),
    })).default([]),
  }),
})

export type LocationSuggestion = z.infer<typeof locationSuggestionSchema>
export type RouteLocation = z.infer<typeof routeLocationSchema>
export type CreateTripApiPayload = z.infer<typeof createTripApiSchema>
