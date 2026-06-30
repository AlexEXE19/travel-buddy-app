import { z } from "zod"

export const genderValues = ["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"] as const
export const preferredTravelTypeValues = ["HIKING", "CITY_BREAK", "BEACH", "CULTURAL", "ADVENTURE", "ROAD_TRIP", "BACKPACKING", "LUXURY"] as const
export const preferredClimateValues = ["TROPICAL", "DRY", "TEMPERATE", "CONTINENTAL", "POLAR", "ANY"] as const
export const preferredTransportValues = ["PLANE", "TRAIN", "BUS", "CAR", "MOTORCYCLE", "BICYCLE", "ANY"] as const
export const preferredAccommodationValues = ["HOTEL", "HOSTEL", "AIRBNB", "CAMPING", "BACKPACKER_LODGE", "ANY"] as const
export const budgetRangeValues = ["BUDGET", "MODERATE", "LUXURY"] as const

export const profileUpdateSchema = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  gender: z.enum(genderValues).optional(),
  nationality: z.string().max(50).optional(),
  countryOfResidence: z.string().max(100).optional(),
  cityOfResidence: z.string().max(100).optional(),
  preferredLanguage: z.string().max(50).optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().max(1000).optional(),
  profilePictureUrl: z.string().max(500).optional(),
  interests: z.array(z.string()).optional(),
  preferredTravelType: z.enum(preferredTravelTypeValues).optional(),
  preferredClimate: z.enum(preferredClimateValues).optional(),
  preferredTransport: z.enum(preferredTransportValues).optional(),
  preferredAccommodation: z.enum(preferredAccommodationValues).optional(),
  budgetRange: z.enum(budgetRangeValues).optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
