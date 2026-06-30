export type Gender = "MALE" | "FEMALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY"
export type PreferredTravelType = "HIKING" | "CITY_BREAK" | "BEACH" | "CULTURAL" | "ADVENTURE" | "ROAD_TRIP" | "BACKPACKING" | "LUXURY"
export type PreferredClimate = "TROPICAL" | "DRY" | "TEMPERATE" | "CONTINENTAL" | "POLAR" | "ANY"
export type PreferredTransport = "PLANE" | "TRAIN" | "BUS" | "CAR" | "MOTORCYCLE" | "BICYCLE" | "ANY"
export type PreferredAccommodation = "HOTEL" | "HOSTEL" | "AIRBNB" | "CAMPING" | "BACKPACKER_LODGE" | "ANY"
export type BudgetRange = "BUDGET" | "MODERATE" | "LUXURY"

export interface UserProfile {
  id: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  gender: Gender | null
  nationality: string | null
  countryOfResidence: string | null
  cityOfResidence: string | null
  preferredLanguage: string | null
  dateOfBirth: string | null
  bio: string | null
  profilePictureUrl: string | null
  budgetRange: BudgetRange | null
  preferredTravelType: PreferredTravelType | null
  preferredClimate: PreferredClimate | null
  preferredTransport: PreferredTransport | null
  preferredAccommodation: PreferredAccommodation | null
  interests: string[]
  visitedPlaces: string[]
  bucketListPlaces: string[]
  subscriptionStatus: string | null
  verified: boolean
  filterFemaleOnly: boolean
  filterVerifiedOnly: boolean
  createdAt: string
  updatedAt: string
}

export interface DiscoverTrip {
  id: string
  title: string | null
  tripType: string | null
  startLocationName: string | null
  startDateTime: string | null
}

export interface UserDiscoverCard {
  userId: string
  firstName: string | null
  lastName: string | null
  profilePictureUrl: string | null
  bio: string | null
  nationality: string | null
  preferredTravelType: string | null
  gender: string | null
  verified: boolean
  interests: string[]
  visitedPlaces: string[]
  bucketListPlaces: string[]
  openTrips: DiscoverTrip[]
}
