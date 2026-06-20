import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles } from "lucide-react"

const conversations = [
  {
    name: "Maya",
    image: "/images/traveler-1.png",
    last: "Sounds perfect! Let's lock in the Algarve dates.",
    time: "2m",
    unread: 2,
  },
  {
    name: "Leo",
    image: "/images/traveler-2.png",
    last: "I found a great hostel near the beach.",
    time: "1h",
    unread: 0,
  },
  {
    name: "TravelBuddy Guide",
    image: "",
    last: "Here are 3 itinerary ideas for your Bali trip.",
    time: "3h",
    unread: 0,
    ai: true,
  },
]

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chat</h1>
          <p className="text-muted-foreground text-sm mt-1">Your matches and trip conversations.</p>
        </div>

        <div className="flex flex-col rounded-xl border border-border bg-card divide-y divide-border">
          {conversations.map((c) => (
            <button
              key={c.name}
              className="flex items-center gap-4 p-4 text-left transition-colors hover:bg-secondary first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  {c.ai ? (
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={c.image || "/placeholder.svg"} alt={c.name} />
                      <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                    </>
                  )}
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground truncate">{c.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{c.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{c.last}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
