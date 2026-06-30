export const tripTypeOptions = [
  { value: "HIKING", label: "Hiking" },
  { value: "CITY_BREAK", label: "City break" },
  { value: "BEACH", label: "Beach" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "OTHER", label: "Other" },
] as const

export type TripTypeValue = (typeof tripTypeOptions)[number]["value"]
