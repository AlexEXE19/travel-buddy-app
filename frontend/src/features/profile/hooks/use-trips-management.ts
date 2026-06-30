"use client"

import { useState } from "react"
import { updateTripStatus, leaveTripAction } from "@/src/features/trips/actions"
import type { Trip, TripStatus } from "@/src/types/trips"

export function useTripsManagement(initialCreated: Trip[], initialJoined: Trip[]) {
  const [createdTrips, setCreatedTrips] = useState<Trip[]>(initialCreated)
  const [joinedTrips, setJoinedTrips] = useState<Trip[]>(initialJoined)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

  async function handleStatusChange(tripId: string, status: TripStatus) {
    const result = await updateTripStatus(tripId, status)
    if (result.error) return
    const applyUpdate = (trips: Trip[]) =>
      trips.map((t) => (t.id === tripId ? { ...t, status } : t))
    setCreatedTrips(applyUpdate)
    setSelectedTrip((cur) => (cur?.id === tripId ? { ...cur, status } : cur))
  }

  async function handleLeaveTrip(tripId: string) {
    const result = await leaveTripAction(tripId)
    if (result.error) return
    setJoinedTrips((trips) => trips.filter((t) => t.id !== tripId))
    if (selectedTrip?.id === tripId) setSelectedTrip(null)
  }

  return {
    createdTrips,
    joinedTrips,
    selectedTrip,
    setSelectedTrip,
    updateTripStatus: handleStatusChange,
    leaveTrip: handleLeaveTrip,
  }
}
