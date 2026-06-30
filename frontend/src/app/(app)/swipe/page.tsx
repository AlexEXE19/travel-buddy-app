import { getDiscoverUsers } from "@/src/features/trips/actions"
import { SwipeView } from "./swipe-view"

export default async function SwipePage() {
  const users = await getDiscoverUsers(10)
  return <SwipeView initialUsers={users ?? []} />
}
