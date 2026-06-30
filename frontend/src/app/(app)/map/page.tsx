import { getOpenTrips } from "@/src/features/trips/actions"
import { getProfile } from "@/src/features/profile/actions"
import { MapClient } from "./map-client"

export default async function MapPage() {
  const [trips, profile] = await Promise.all([getOpenTrips(), getProfile()])
  return <MapClient initialTrips={trips ?? []} myUserId={profile?.id ?? null} />
}
