import { z } from "zod"
import { tripStatusOptions } from "@/data/trip-statuses"

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

export const createTripSchema = z.object({
  title: z.string().min(1, "Trip title is required"),
  startDate: z.string().min(1, "Start date is required"),
  capacity: z.number().int().min(2).max(5),
  tripStyle: z.string().min(1, "Trip style is required"),
  tripStatus: z.enum(tripStatusOptions).default("open"),
  startPoint: locationSuggestionSchema,
  destination: routeLocationSchema,
  stops: z.array(routeLocationSchema).max(5).default([]),
})

export type LocationSuggestion = z.infer<typeof locationSuggestionSchema>
export type RouteLocation = z.infer<typeof routeLocationSchema>
export type CreateTripInput = z.infer<typeof createTripSchema>