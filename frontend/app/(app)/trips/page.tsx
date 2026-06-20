import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, CalendarDays, Users } from "lucide-react"

const trips = [
  {
    title: "Coastal road trip",
    destination: "Algarve, Portugal",
    dates: "Jul 12 – Jul 20",
    members: 3,
    status: "Planning",
    image: "/images/feature-explore.png",
  },
  {
    title: "Island hopping",
    destination: "Bali, Indonesia",
    dates: "Sep 2 – Sep 14",
    members: 2,
    status: "Confirmed",
    image: "/images/hero-travelers.png",
  },
]

export default function TripsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Trips</h1>
            <p className="text-muted-foreground text-sm mt-1">Plan, join and manage your adventures.</p>
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            New trip
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <Card key={trip.title} className="overflow-hidden pt-0">
              <div className="relative aspect-[16/9]">
                <Image src={trip.image || "/placeholder.svg"} alt={trip.title} fill className="object-cover" />
                <Badge
                  className={
                    trip.status === "Confirmed"
                      ? "absolute top-3 right-3 bg-primary text-primary-foreground"
                      : "absolute top-3 right-3 bg-accent text-accent-foreground"
                  }
                >
                  {trip.status}
                </Badge>
              </div>
              <CardContent className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-foreground">{trip.title}</h2>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {trip.destination}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {trip.dates}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {trip.members} travelers
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
