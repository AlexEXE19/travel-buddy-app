import { Badge } from "@/src/components/ui/badge"
import { getProfileDetailsMapping } from "@/src/features/profile/utils"
import { Sparkles, MapPinned, Star } from "lucide-react"
import type { UserProfile } from "@/src/types/profile"

export default function UserInfo({ profile }: { profile: UserProfile }) {
  const details = getProfileDetailsMapping(profile)
  const filledDetails = details.filter((d) => d.value !== null && d.value !== "")

  return (
    <>
      {filledDetails.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {filledDetails.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="card-hover tint-card flex items-center gap-3 rounded-xl border border-border p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {profile.interests && profile.interests.length > 0 && (
        <SectionCard icon={<Sparkles className="h-4 w-4" />} title="Interests">
          <div className="flex flex-wrap gap-2">
            {[...new Set(profile.interests)].map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {interest}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {profile.visitedPlaces && profile.visitedPlaces.length > 0 && (
        <SectionCard icon={<MapPinned className="h-4 w-4" />} title="Places visited">
          <div className="flex flex-wrap gap-2">
            {[...new Set(profile.visitedPlaces)].map((place) => (
              <span
                key={place}
                className="rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1 text-xs font-medium text-foreground"
              >
                📍 {place}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {profile.bucketListPlaces && profile.bucketListPlaces.length > 0 && (
        <SectionCard icon={<Star className="h-4 w-4" />} title="Bucket list">
          <div className="flex flex-wrap gap-2">
            {[...new Set(profile.bucketListPlaces)].map((place) => (
              <Badge
                key={place}
                className="border-amber-200 bg-amber-500/10 px-3 py-1 text-xs text-amber-700 hover:bg-amber-500/20"
              >
                ⭐ {place}
              </Badge>
            ))}
          </div>
        </SectionCard>
      )}
    </>
  )
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="tint-card rounded-2xl border border-border p-5">
      <div className="accent-bar mb-3 flex items-center gap-2 pl-3">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}
