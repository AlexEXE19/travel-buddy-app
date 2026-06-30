import { LucideIcon, Phone, User, Globe, MapPin, Calendar, Compass, CloudSun, Train, Home, Wallet } from "lucide-react"
import type { UserProfile } from "@/src/types/profile"
import type { TripStatus } from "@/src/features/trips/constants/trip-statuses"

interface ProfileDetailItem {
  icon: LucideIcon
  label: string
  value: string | null
}

export function getProfileDetailsMapping(profile: UserProfile): ProfileDetailItem[] {
  const budgetLabels: Record<string, string> = {
    BUDGET: "Budget traveler",
    MODERATE: "Moderate spender",
    LUXURY: "Luxury traveler",
  }

  return [
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: User, label: "Gender", value: profile.gender ? formatEnum(profile.gender) : null },
    { icon: Globe, label: "Nationality", value: profile.nationality },
    { icon: Wallet, label: "Budget style", value: profile.budgetRange ? (budgetLabels[profile.budgetRange] ?? profile.budgetRange) : null },
    { icon: MapPin, label: "Country", value: profile.countryOfResidence },
    { icon: MapPin, label: "City", value: profile.cityOfResidence },
    { icon: Globe, label: "Language", value: profile.preferredLanguage },
    { icon: Calendar, label: "Date of birth", value: profile.dateOfBirth },
    { icon: Compass, label: "Travel type", value: profile.preferredTravelType ? formatEnum(profile.preferredTravelType) : null },
    { icon: CloudSun, label: "Climate", value: profile.preferredClimate ? formatEnum(profile.preferredClimate) : null },
    { icon: Train, label: "Transport", value: profile.preferredTransport ? formatEnum(profile.preferredTransport) : null },
    { icon: Home, label: "Accommodation", value: profile.preferredAccommodation ? formatEnum(profile.preferredAccommodation) : null },
  ]
}

export function formatEnum(value: string): string {
  return value.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
}

// Only OPEN and CANCELLED are creator-settable; toggles between them.
export function toggleCreatorStatus(status: TripStatus): TripStatus {
  return status === "CANCELLED" ? "OPEN" : "CANCELLED"
}

export function formatLocation(label: string, lat: number, lng: number): string {
  return `${label} (${lat.toFixed(4)}, ${lng.toFixed(4)})`
}

export function getDurationLabel(durationAmount: number | null | undefined, durationUnit: "hours" | "days" | null | undefined): string {
  if (!durationAmount || !durationUnit) return "No duration set"
  return `${durationAmount} ${durationUnit}`
}

export function formatTripDate(isoString: string | null | undefined): string {
  if (!isoString) return "No date set"
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "Invalid date"
  }
}
