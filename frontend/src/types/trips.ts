export type TripStatus = "OPEN" | "FILLED" | "CANCELLED" | "COMPLETED"
export type TripType = "HIKING" | "CITY_BREAK" | "BEACH" | "CULTURAL" | "ADVENTURE" | "OTHER"

export interface ItineraryStop {
  id: string
  orderIndex: number
  name: string
  latitude: number
  longitude: number
  arrivalDateTime: string | null
  departureDateTime: string | null
}

export interface Itinerary {
  id: string
  startDateTime: string
  startLocationName: string
  startLat: number
  startLng: number
  endDateTime: string | null
  stops: ItineraryStop[]
}

export interface Trip {
  id: string
  title: string
  description: string | null
  creatorId: string
  tripType: TripType
  status: TripStatus
  maxCapacity: number
  womenOnly: boolean
  members: string[]
  itinerary: Itinerary | null
  createdAt: string
  updatedAt: string
}

// Returned by GET /api/v1/matching/discover — itinerary is a summary (no stops array)
export interface DiscoverItinerary {
  id: string
  startLocationName: string | null
  startDateTime: string | null
  endDateTime: string | null
  startLat: number | null
  startLng: number | null
}

export interface DiscoverTrip {
  id: string
  title: string
  description: string | null
  tripType: TripType
  status: TripStatus
  maxCapacity: number
  creatorId: string
  members: string[]
  itinerary: DiscoverItinerary | null
}
