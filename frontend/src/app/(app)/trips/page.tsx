import { getCreatedTrips, getJoinedTrips } from "@/src/features/trips/actions"
import { TripsView } from "@/src/features/trips/components/trips-view"

export default async function TripsPage() {
  const [createdTrips, joinedTrips] = await Promise.all([
    getCreatedTrips(),
    getJoinedTrips(),
  ])

  return (
    <TripsView
      initialCreated={createdTrips ?? []}
      initialJoined={joinedTrips ?? []}
    />
  )
}
