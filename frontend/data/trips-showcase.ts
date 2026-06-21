import type { TripStatus } from "@/data/trip-statuses"

export type TripParticipant = {
  id: string
  name: string
  role: string
  bio: string
  avatarUrl: string
  accent?: string
}

export type RouteLocation = {
  id: string
  label: string
  lat: number
  lng: number
}

export type RouteStep = {
  location: RouteLocation
  durationAmount: number | null
  durationUnit: "hours" | "days" | null
}

export type TripRecord = {
  id: string
  owner: "created" | "joined"
  title: string
  destination: string
  dates: string
  members: number
  capacity: number
  status: TripStatus
  image: string
  style: string
  description: string
  startDate: string
  endDate: string
  creator: TripParticipant
  participants: TripParticipant[]
  startPoint: RouteLocation
  destinationLocation: RouteStep
  stops: RouteStep[]
}

export const createdTrips: TripRecord[] = [
  {
    id: "created-1",
    owner: "created",
    title: "Coastal road trip",
    destination: "Algarve, Portugal",
    dates: "Jul 12 - Jul 20",
    members: 3,
    capacity: 5,
    status: "open",
    image: "/images/feature-explore.png",
    style: "Road trip",
    description: "Sunrise drives, beach stops and one slow day in the old town.",
    startDate: "2026-07-12",
    endDate: "2026-07-20",
    creator: {
      id: "creator-1",
      name: "Marta Silva",
      role: "Trip creator",
      bio: "Road-trip planner who likes slow mornings, hidden beaches and routes that leave room for spontaneity.",
      avatarUrl: "/images/traveler-1.png",
      accent: "Portugal",
    },
    participants: [
      {
        id: "p-1",
        name: "Jonas Meyer",
        role: "Joined traveler",
        bio: "Photographer and map nerd. Likes sunsets, long drives and picking up local snacks along the way.",
        avatarUrl: "/images/traveler-2.png",
        accent: "Germany",
      },
      {
        id: "p-2",
        name: "Amina Youssef",
        role: "Joined traveler",
        bio: "Remote designer who travels light and looks for good coffee near every stop.",
        avatarUrl: "/images/traveler-1.png",
        accent: "Morocco",
      },
    ],
    startPoint: {
      id: "start-1",
      label: "Lisbon Airport, Portugal",
      lat: 38.7742,
      lng: -9.1342,
    },
    destinationLocation: {
      location: {
        id: "dest-1",
        label: "Algarve, Portugal",
        lat: 37.0194,
        lng: -7.9304,
      },
      durationAmount: 2,
      durationUnit: "days",
    },
    stops: [
      {
        location: {
          id: "stop-1",
          label: "Alentejo Coast",
          lat: 37.5981,
          lng: -8.7549,
        },
        durationAmount: 1,
        durationUnit: "days",
      },
    ],
  },
  {
    id: "created-2",
    owner: "created",
    title: "Island hopping",
    destination: "Bali, Indonesia",
    dates: "Sep 2 - Sep 14",
    members: 2,
    capacity: 4,
    status: "filled",
    image: "/images/hero-travelers.png",
    style: "Adventure sports",
    description: "A packed route with surf lessons, temple visits and a final beach stay.",
    startDate: "2026-09-02",
    endDate: "2026-09-14",
    creator: {
      id: "creator-2",
      name: "Ravi Patel",
      role: "Trip creator",
      bio: "Adventure-first organizer who keeps routes active, flexible and full of water stops.",
      avatarUrl: "/images/traveler-2.png",
      accent: "India",
    },
    participants: [
      {
        id: "p-3",
        name: "Sofia Kim",
        role: "Joined traveler",
        bio: "Yoga teacher with a habit of finding the best sunrise spots before everyone else.",
        avatarUrl: "/images/traveler-1.png",
        accent: "South Korea",
      },
    ],
    startPoint: {
      id: "start-2",
      label: "Singapore",
      lat: 1.3521,
      lng: 103.8198,
    },
    destinationLocation: {
      location: {
        id: "dest-2",
        label: "Bali, Indonesia",
        lat: -8.4095,
        lng: 115.1889,
      },
      durationAmount: 6,
      durationUnit: "days",
    },
    stops: [
      {
        location: {
          id: "stop-2",
          label: "Nusa Penida",
          lat: -8.7288,
          lng: 115.5442,
        },
        durationAmount: 2,
        durationUnit: "days",
      },
      {
        location: {
          id: "stop-3",
          label: "Ubud",
          lat: -8.5069,
          lng: 115.2625,
        },
        durationAmount: 3,
        durationUnit: "days",
      },
    ],
  },
  {
    id: "created-3",
    owner: "created",
    title: "City break lights",
    destination: "Tokyo, Japan",
    dates: "Nov 3 - Nov 9",
    members: 4,
    capacity: 4,
    status: "completed",
    image: "/images/feature-explore.png",
    style: "City break",
    description: "A finished trip with museums, ramen spots and late-night neighborhoods.",
    startDate: "2026-11-03",
    endDate: "2026-11-09",
    creator: {
      id: "creator-3",
      name: "Yuki Tanaka",
      role: "Trip creator",
      bio: "City guide fan who likes compact routes, good transit and a lot of late-night food.",
      avatarUrl: "/images/traveler-1.png",
      accent: "Japan",
    },
    participants: [
      {
        id: "p-4",
        name: "Marco Rossi",
        role: "Joined traveler",
        bio: "Museum hopper and coffee hunter who keeps the group on schedule.",
        avatarUrl: "/images/traveler-2.png",
        accent: "Italy",
      },
    ],
    startPoint: {
      id: "start-3",
      label: "Osaka, Japan",
      lat: 34.6937,
      lng: 135.5023,
    },
    destinationLocation: {
      location: {
        id: "dest-3",
        label: "Tokyo, Japan",
        lat: 35.6762,
        lng: 139.6503,
      },
      durationAmount: 5,
      durationUnit: "days",
    },
    stops: [],
  },
]

export const joinedTrips: TripRecord[] = [
  {
    id: "joined-1",
    owner: "joined",
    title: "Tokyo nights",
    destination: "Tokyo, Japan",
    dates: "Aug 5 - Aug 11",
    members: 5,
    capacity: 5,
    status: "open",
    image: "/images/feature-explore.png",
    style: "City break",
    description: "Food markets, late trains and a few hidden neighborhood bars.",
    startDate: "2026-08-05",
    endDate: "2026-08-11",
    creator: {
      id: "creator-4",
      name: "Hana Ito",
      role: "Trip creator",
      bio: "Food and night-market traveler who likes safe routes and small groups.",
      avatarUrl: "/images/traveler-1.png",
      accent: "Japan",
    },
    participants: [
      {
        id: "p-5",
        name: "Leo Martin",
        role: "Joined traveler",
        bio: "Street photographer who loves neon, trains and quick local detours.",
        avatarUrl: "/images/traveler-2.png",
        accent: "France",
      },
      {
        id: "p-6",
        name: "Chloe Adams",
        role: "Joined traveler",
        bio: "Travel writer collecting ramen spots and neighborhood finds.",
        avatarUrl: "/images/traveler-1.png",
        accent: "United Kingdom",
      },
    ],
    startPoint: {
      id: "start-4",
      label: "Seoul, South Korea",
      lat: 37.5665,
      lng: 126.978,
    },
    destinationLocation: {
      location: {
        id: "dest-4",
        label: "Tokyo, Japan",
        lat: 35.6762,
        lng: 139.6503,
      },
      durationAmount: 6,
      durationUnit: "days",
    },
    stops: [],
  },
  {
    id: "joined-2",
    owner: "joined",
    title: "Patagonia trail week",
    destination: "Patagonia, Argentina",
    dates: "Oct 8 - Oct 18",
    members: 4,
    capacity: 5,
    status: "cancelled",
    image: "/images/hero-travelers.png",
    style: "Nature escape",
    description: "A hiking-heavy route with glacier viewpoints and camp nights.",
    startDate: "2026-10-08",
    endDate: "2026-10-18",
    creator: {
      id: "creator-5",
      name: "Diego Alvarez",
      role: "Trip creator",
      bio: "Outdoors-first organizer who prefers mountain trails, early starts and clear routes.",
      avatarUrl: "/images/traveler-2.png",
      accent: "Argentina",
    },
    participants: [
      {
        id: "p-7",
        name: "Nora Svensson",
        role: "Joined traveler",
        bio: "Hiker who likes long hikes, warm socks and campfire dinners.",
        avatarUrl: "/images/traveler-1.png",
        accent: "Sweden",
      },
    ],
    startPoint: {
      id: "start-5",
      label: "Santiago, Chile",
      lat: -33.4489,
      lng: -70.6693,
    },
    destinationLocation: {
      location: {
        id: "dest-5",
        label: "Patagonia, Argentina",
        lat: -50.9423,
        lng: -73.4068,
      },
      durationAmount: 7,
      durationUnit: "days",
    },
    stops: [],
  },
]

export const calendarTrips = [...createdTrips, ...joinedTrips].filter((trip) => trip.status !== "cancelled")
