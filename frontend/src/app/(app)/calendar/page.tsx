import { getCreatedTrips, getJoinedTrips } from "@/src/features/trips/actions"
import { CalendarView } from "@/src/features/trips/components/calendar-view"

export default async function CalendarPage() {
  const [created, joined] = await Promise.all([getCreatedTrips(), getJoinedTrips()])
  return <CalendarView created={created ?? []} joined={joined ?? []} />
}
