"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent } from "@/src/components/ui/card"
import { Crown, Check, Lock, BadgeCheck, Sparkles, CreditCard } from "lucide-react"
import { subscribePremium, cancelPremium } from "@/src/features/premium/actions"

const PERKS = [
  "Unlimited connections",
  "See who liked you",
  "Priority placement in Discover",
  "A verified Premium badge",
  "Advanced travel filters",
]

const PRICE = "€9.99"

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

export function PremiumView({ isPremium }: { isPremium: boolean }) {
  const router = useRouter()
  const [premium, setPremium] = useState(isPremium)
  const [card, setCard] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function pay() {
    setError(null)
    if (card.replace(/\s/g, "").length < 16 || expiry.length < 5 || cvc.length < 3 || !name.trim()) {
      setError("Please complete all card fields.")
      return
    }
    setLoading(true)
    // Simulate Stripe processing latency, then activate.
    await new Promise((r) => setTimeout(r, 1200))
    const res = await subscribePremium()
    setLoading(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setSuccess(true)
    setPremium(true)
    setTimeout(() => router.refresh(), 800)
  }

  async function cancel() {
    setLoading(true)
    const res = await cancelPremium()
    setLoading(false)
    if (!res.error) {
      setPremium(false)
      router.refresh()
    }
  }

  // ---- Already premium ----
  if (premium && !success) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg">
          <Crown className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold gradient-text">You’re Premium ✨</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for supporting TravelBuddy. Your Premium benefits are active.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/profile">Back to profile</Link>
          </Button>
          <Button variant="ghost" className="text-destructive" onClick={cancel} disabled={loading}>
            {loading ? "Cancelling…" : "Cancel subscription"}
          </Button>
        </div>
      </div>
    )
  }

  // ---- Success splash ----
  if (success) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center animate-fade-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Welcome to Premium! 🎉</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your account has been upgraded.</p>
      </div>
    )
  }

  // ---- Checkout ----
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600">
          <Crown className="h-4 w-4" /> TravelBuddy Premium
        </span>
        <h1 className="mt-3 text-3xl font-bold gradient-text">Upgrade your journey</h1>
        <p className="mt-1 text-muted-foreground">Cancel anytime. {PRICE}/month.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan */}
        <Card className="tint-card">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{PRICE}</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2.5">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" /> 7-day money-back guarantee
            </p>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="tint-card">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CreditCard className="h-4 w-4 text-primary" /> Payment details
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="card" className="text-xs">Card number</Label>
              <Input
                id="card"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={card}
                onChange={(e) => setCard(formatCardNumber(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="exp" className="text-xs">Expiry</Label>
                <Input
                  id="exp"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvc" className="text-xs">CVC</Label>
                <Input
                  id="cvc"
                  inputMode="numeric"
                  placeholder="123"
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Name on card</Label>
              <Input id="name" placeholder="Jane Traveler" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              onClick={pay}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-90"
            >
              {loading ? "Processing…" : `Pay ${PRICE}`}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Simulated Stripe test checkout — no real charge. Test card 4242 4242 4242 4242.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
