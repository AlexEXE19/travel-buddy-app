"use client"

import dynamic from "next/dynamic"
import type { Trip } from "@/src/types/trips"

const MapView = dynamic(() => import("./map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="h-[560px] rounded-2xl border bg-muted/30 flex items-center justify-center text-muted-foreground">
          Loading map…
        </div>
      </div>
    </div>
  ),
})

export function MapClient({
  initialTrips,
  myUserId,
}: {
  initialTrips: Trip[]
  myUserId: string | null
}) {
  return <MapView initialTrips={initialTrips} myUserId={myUserId} />
}
