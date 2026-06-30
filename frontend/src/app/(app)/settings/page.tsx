import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { LogOut, Crown, ArrowRight } from "lucide-react"
import { signoutAndRedirect } from "@/src/actions"
import { getProfile } from "@/src/features/profile/actions"
import { SettingsToggles } from "./settings-toggles"

export default async function SettingsPage() {
  const profile = await getProfile()
  const isPremium = (profile?.subscriptionStatus ?? "").toUpperCase() === "PREMIUM"
  const isFemale = (profile?.gender ?? "").toUpperCase() === "FEMALE"
  const isVerified = profile?.verified ?? false

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your preferences and safety.</p>
        </div>

        {/* Premium upgrade CTA — hidden for users who are already Premium */}
        {!isPremium && (
          <Link href="/premium" className="block">
            <div className="card-hover relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-400 to-amber-500 p-5 text-white shadow-lg">
              <div className="pointer-events-none absolute -top-10 -right-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                    <Crown className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-semibold">Upgrade to Premium</p>
                    <p className="text-sm text-white/85">Unlock more connections and stand out — €9.99/mo.</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0" />
              </div>
            </div>
          </Link>
        )}

        {isPremium && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-500/10 p-4 text-amber-700">
            <Crown className="h-5 w-5" />
            <p className="text-sm font-medium">You’re a Premium member. Thanks for your support! ✨</p>
          </div>
        )}

        <SettingsToggles
          isFemale={isFemale}
          isVerified={isVerified}
          initialFemaleOnly={profile?.filterFemaleOnly ?? false}
          initialVerifiedOnly={profile?.filterVerifiedOnly ?? false}
        />

        <Card className="tint-card">
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/profile/edit">
              <Button variant="outline" className="w-full justify-start">
                Edit profile details
              </Button>
            </Link>
            <form action={signoutAndRedirect}>
              <Button type="submit" variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
