"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import type { Itinerary } from "@/src/types/trips"

// Fix the default Leaflet marker icon broken by webpack/Next.js bundling
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

function makeNumberedIcon(num: number, color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${color};color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:700;
      border:2px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,0.35);
    ">${num}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

function makeStartIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:#2563eb;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:13px;font-weight:700;
      border:3px solid #fff;
      box-shadow:0 1px 6px rgba(0,0,0,0.4);
    ">S</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  })
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 12)
      return
    }
    const bounds = L.latLngBounds(points.map(([lat, lng]) => L.latLng(lat, lng)))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, points])
  return null
}

interface ParticipantStripProps {
  creatorId: string
  members: string[]
  maxCapacity: number
}

function ParticipantStrip({ creatorId, members, maxCapacity }: ParticipantStripProps) {
  const colors = ["#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626"]
  const filledSlots = members.length + 1 // +1 for creator
  const emptySlots = maxCapacity - filledSlots

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "rgba(255,255,255,0.9)",
        borderRadius: 24,
        padding: "6px 10px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.2)",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* Creator circle */}
      <div
        title="Trip creator"
        style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#2563eb",
          border: "2px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 11, fontWeight: 700,
          cursor: "default",
        }}
      >
        ★
      </div>

      {/* Member circles */}
      {members.slice(0, maxCapacity - 1).map((memberId, i) => (
        <div
          key={memberId}
          title={`Member ${i + 1}`}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: colors[i % colors.length],
            border: "2px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 700,
            marginLeft: i === 0 ? -4 : -6,
          }}
        >
          {i + 1}
        </div>
      ))}

      {/* Empty slots */}
      {Array.from({ length: Math.max(0, emptySlots) }).map((_, i) => (
        <div
          key={`empty-${i}`}
          title="Open slot"
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "transparent",
            border: "2px dashed #cbd5e1",
            marginLeft: -6,
          }}
        />
      ))}

      <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4, whiteSpace: "nowrap" }}>
        {filledSlots}/{maxCapacity}
      </span>
    </div>
  )
}

interface TripMapProps {
  itinerary: Itinerary
  creatorId: string
  members: string[]
  maxCapacity: number
  height?: number
}

export function TripMap({ itinerary, creatorId, members, maxCapacity, height = 380 }: TripMapProps) {
  const initialized = useRef(false)
  if (!initialized.current) {
    fixLeafletIcons()
    initialized.current = true
  }

  const startPoint: [number, number] = [itinerary.startLat, itinerary.startLng]

  const sortedStops = [...itinerary.stops].sort((a, b) => a.orderIndex - b.orderIndex)
  const stopPoints: [number, number][] = sortedStops.map((s) => [s.latitude, s.longitude])

  const allPoints: [number, number][] = [startPoint, ...stopPoints]

  const stopColors = ["#059669", "#7c3aed", "#d97706", "#0891b2", "#dc2626"]

  return (
    <div style={{ position: "relative", height, borderRadius: 16, overflow: "hidden" }}>
      <MapContainer
        center={startPoint}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds points={allPoints} />

        {/* Start marker */}
        <Marker position={startPoint} icon={makeStartIcon()}>
          <Popup>
            <strong>Start</strong>
            <br />
            {itinerary.startLocationName}
          </Popup>
        </Marker>

        {/* Stop markers */}
        {sortedStops.map((stop, i) => (
          <Marker
            key={stop.id}
            position={[stop.latitude, stop.longitude]}
            icon={makeNumberedIcon(i + 1, stopColors[i % stopColors.length])}
          >
            <Popup>
              <strong>Stop {i + 1}</strong>
              <br />
              {stop.name}
            </Popup>
          </Marker>
        ))}

        {/* Route polyline */}
        {allPoints.length > 1 && (
          <Polyline
            positions={allPoints}
            pathOptions={{ color: "#2563eb", weight: 3, opacity: 0.7, dashArray: "8 4" }}
          />
        )}
      </MapContainer>

      {/* Participant strip overlaid on the map */}
      <ParticipantStrip creatorId={creatorId} members={members} maxCapacity={maxCapacity} />
    </div>
  )
}
