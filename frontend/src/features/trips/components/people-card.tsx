import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

interface Person {
  name: string
  avatarUrl?: string | null
  role?: string | null
  bio?: string | null
  accent?: string | null
}

export default function PeopleCard({ person, highlight = false }: { person: Person; highlight?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-3 ${highlight ? "bg-background" : "bg-background/70"}`}>
      <Avatar className="h-12 w-12">
        <AvatarImage src={person.avatarUrl ?? undefined} alt={person.name} />
        <AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-foreground">{person.name}</p>
          {person.accent ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{person.accent}</span>
          ) : null}
        </div>
        {person.role && <p className="text-xs text-muted-foreground">{person.role}</p>}
        {person.bio && <p className="mt-1 text-sm text-muted-foreground">{person.bio}</p>}
      </div>
    </div>
  )
}
