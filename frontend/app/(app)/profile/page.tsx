import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Globe, Wallet, Crown, Pencil, MapPin, Calendar } from "lucide-react"
import { getProfile } from "@/actions/profile"

export default async function ProfilePage() {
  const profile = await getProfile()

  if (!profile) redirect("/login")

  const details = [
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: User, label: "Gender", value: profile.gender },
    { icon: Globe, label: "Nationality", value: profile.nationality },
    { icon: Wallet, label: "Travel Budget", value: profile.budget ? `$${profile.budget.toLocaleString()}` : null },
    { icon: MapPin, label: "Country", value: profile.countryOfResidence },
    { icon: MapPin, label: "City", value: profile.cityOfResidence },
    { icon: Globe, label: "Language", value: profile.preferredLanguage },
    { icon: Calendar, label: "Date of Birth", value: profile.dateOfBirth },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <Link href="/profile/edit">
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center gap-3 pt-8 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {profile.firstName || "Traveler"} {profile.lastName || ""}
            </h2>
            {profile.bio && (
              <p className="text-muted-foreground text-sm max-w-sm">{profile.bio}</p>
            )}
            {profile.subscriptionStatus && (
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                <Crown className="h-3 w-3 mr-1" />
                {profile.subscriptionStatus}
              </Badge>
            )}
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          {details.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value || "Not provided"}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}