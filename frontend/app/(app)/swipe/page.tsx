"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Heart, MapPin, Sparkles } from "lucide-react"

const candidates = [
  {
    name: "Maya",
    age: 27,
    location: "Lisbon, Portugal",
    bio: "Sunrise hikes, street food and spontaneous train rides. Looking for a buddy to explore Southern Europe this summer.",
    interests: ["Hiking", "Food", "Photography"],
    image: "/images/traveler-1.png",
  },
  {
    name: "Leo",
    age: 30,
    location: "Bali, Indonesia",
    bio: "Surf in the morning, work in the afternoon, explore at night. Always up for a new island.",
    interests: ["Surfing", "Diving", "Coworking"],
    image: "/images/traveler-2.png",
  },
]

export default function SwipePage() {
  const [index, setIndex] = useState(0)
  const current = candidates[index % candidates.length]

  const next = () => setIndex((i) => i + 1)

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Discover travelers</h1>
        <p className="text-muted-foreground text-sm mt-1">Swipe to find your next travel buddy.</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="relative aspect-[3/4]">
            <Image
              src={current.image || "/placeholder.svg"}
              alt={`${current.name}'s profile photo`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
              <h2 className="text-2xl font-bold">
                {current.name}, {current.age}
              </h2>
              <p className="flex items-center gap-1 text-sm text-white/90">
                <MapPin className="h-4 w-4" />
                {current.location}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">{current.bio}</p>
            <div className="flex flex-wrap gap-2">
              {current.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="font-normal">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6">
          <Button
            size="icon"
            variant="outline"
            onClick={next}
            className="h-16 w-16 rounded-full border-2"
            aria-label="Pass"
          >
            <X className="h-7 w-7 text-destructive" />
          </Button>
          <Button
            size="icon"
            onClick={next}
            className="h-16 w-16 rounded-full"
            aria-label="Like"
          >
            <Heart className="h-7 w-7" />
          </Button>
        </div>

        <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-4">
          <Sparkles className="h-3 w-3 text-accent" />
          Matches are suggested by your interests and travel style
        </p>
      </div>
    </div>
  )
}
