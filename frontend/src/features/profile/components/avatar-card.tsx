import { Badge } from "@/src/components/ui/badge"
import { User, Crown, MapPin } from "lucide-react"
import { VerifiedBadge } from "@/src/components/verified-badge"
import type { UserProfile } from "@/src/types/profile"

function calculateCompleteness(profile: UserProfile): number {
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.phone,
    profile.dateOfBirth,
    profile.gender,
    profile.nationality,
    profile.bio,
    profile.profilePictureUrl,
    profile.budgetRange,
    profile.preferredTravelType,
    profile.preferredClimate,
    profile.preferredTransport,
    profile.preferredAccommodation,
  ]
  const boolFields = [
    (profile.interests?.length ?? 0) > 0,
    (profile.visitedPlaces?.length ?? 0) > 0,
    (profile.bucketListPlaces?.length ?? 0) > 0,
  ]
  const filledScalar = fields.filter((f) => f !== null && f !== undefined && f !== "").length
  const filledBool = boolFields.filter(Boolean).length
  const total = fields.length + boolFields.length
  return Math.round(((filledScalar + filledBool) / total) * 100)
}

export default function AvatarCard({ profile }: { profile: UserProfile }) {
  const completeness = calculateCompleteness(profile)
  const fullName = `${profile.firstName ?? "Traveler"} ${profile.lastName ?? ""}`.trim()
  const location = [profile.cityOfResidence, profile.countryOfResidence].filter(Boolean).join(", ")

  return (
    <div className="tint-card overflow-hidden rounded-2xl border border-border shadow-lg">
      {/* Gradient cover */}
      <div className="relative h-32 bg-gradient-to-br from-primary via-primary to-accent">
        <div className="pointer-events-none absolute -top-8 -right-6 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      </div>

      <div className="relative z-10 px-6 pb-6">
        {/* Avatar overlapping the cover */}
        <div className="-mt-16 flex flex-col items-center text-center">
          {profile.profilePictureUrl ? (
            <img
              src={profile.profilePictureUrl}
              alt={`${profile.firstName ?? "User"}'s avatar`}
              className="h-28 w-28 rounded-full border-4 border-card object-cover object-top shadow-md"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary/20 to-accent/20 shadow-md">
              <User className="h-12 w-12 text-primary" />
            </div>
          )}

          <h2 className="mt-3 flex items-center gap-1.5 text-2xl font-bold text-foreground">
            {fullName}
            {profile.verified && <VerifiedBadge className="h-5 w-5" />}
          </h2>

          {location && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {location}
            </p>
          )}

          {profile.subscriptionStatus && (
            <Badge className="mt-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:opacity-90">
              <Crown className="mr-1 h-3 w-3" />
              {profile.subscriptionStatus}
            </Badge>
          )}

          {profile.bio && (
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
          )}
        </div>

        {/* Completeness */}
        {completeness < 100 && (
          <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Profile {completeness}% complete</span>
              <span className="text-muted-foreground">Fill more to be more visible</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
