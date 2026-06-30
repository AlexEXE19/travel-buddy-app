export const tripStatusOptions = ["OPEN", "FILLED", "CANCELLED", "COMPLETED"] as const
export type TripStatus = (typeof tripStatusOptions)[number]

export const tripStatusLabels: Record<TripStatus, string> = {
  OPEN: "Open",
  FILLED: "Filled",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
}

export const tripStatusStyles: Record<TripStatus, string> = {
  OPEN: "bg-emerald-600 text-white border-emerald-500 shadow-sm",
  FILLED: "bg-blue-600 text-white border-blue-500 shadow-sm",
  CANCELLED: "bg-rose-600 text-white border-rose-500 shadow-sm",
  COMPLETED: "bg-slate-700 text-white border-slate-600 shadow-sm",
}
