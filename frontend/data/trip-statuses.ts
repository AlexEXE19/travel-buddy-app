export const tripStatusOptions = ["open", "filled", "cancelled", "completed"] as const

export type TripStatus = (typeof tripStatusOptions)[number]

export const tripStatusLabels: Record<TripStatus, string> = {
  open: "Open",
  filled: "Filled",
  cancelled: "Cancelled",
  completed: "Completed",
}

export const tripStatusStyles: Record<TripStatus, string> = {
  open: "bg-emerald-600 text-white border-emerald-500 shadow-sm",
  filled: "bg-blue-600 text-white border-blue-500 shadow-sm",
  cancelled: "bg-rose-600 text-white border-rose-500 shadow-sm",
  completed: "bg-slate-700 text-white border-slate-600 shadow-sm",
}
