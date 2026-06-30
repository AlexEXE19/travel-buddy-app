import { getProfile } from "@/src/features/profile/actions"
import { PremiumView } from "@/src/features/premium/components/premium-view"

export default async function PremiumPage() {
  const profile = await getProfile()
  const isPremium = (profile?.subscriptionStatus ?? "").toUpperCase() === "PREMIUM"
  return <PremiumView isPremium={isPremium} />
}
