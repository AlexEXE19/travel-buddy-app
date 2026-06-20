import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Compass,
  Heart,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Users,
  MapPinned,
  MessageCircle,
  ArrowRight,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">TravelBuddy</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <span className="inline-flex items-center gap-2 w-fit rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                <Sparkles className="h-4 w-4" />
                Your adventure starts with the right people
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance leading-tight">
                Find your people. Then find the world.
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-xl leading-relaxed">
                TravelBuddy matches you with travelers who share your interests, keeps you safe along the way, and
                guides every step of the journey. Adventure is better together.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start your journey
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    I already have an account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/hero-travelers.png"
                alt="A group of happy travelers enjoying a scenic overlook together"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Three Main Ideas */}
        <section className="bg-card border-y border-border py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Three reasons travelers love TravelBuddy
              </h2>
              <p className="text-muted-foreground mt-4 text-pretty">
                Everything you need to turn a destination into an unforgettable story.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Idea 1 */}
              <article className="flex flex-col rounded-2xl border border-border bg-background overflow-hidden">
                <div className="relative aspect-[3/2]">
                  <Image
                    src="/images/feature-explore.png"
                    alt="Two friends exploring a colorful old town together"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPinned className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Travel your way</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Find trips based on your interests</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Hiking, food crawls, festivals or slow weekends away. Discover trips and people that match
                    exactly what you love, then plan it together.
                  </p>
                </div>
              </article>

              {/* Idea 2 */}
              <article className="flex flex-col rounded-2xl border border-border bg-background overflow-hidden">
                <div className="relative aspect-[3/2]">
                  <Image
                    src="/images/hero-travelers.png"
                    alt="Travelers meeting and learning together on a trip"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Grow & connect</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">See new places, meet new people</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Organize yourself, explore somewhere new, meet great people and learn something along the way.
                    Then do it all over again.
                  </p>
                </div>
              </article>

              {/* Idea 3 */}
              <article className="flex flex-col rounded-2xl border border-border bg-background overflow-hidden">
                <div className="relative aspect-[3/2]">
                  <Image
                    src="/images/feature-ai.png"
                    alt="A traveler using an AI guide on their phone in a new city"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Always guided</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Your AI travel guide & helper</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    From building the perfect itinerary to local tips in the moment, our AI guide is with you the
                    whole way, so you never feel lost.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl order-last lg:order-first">
              <Image
                src="/images/feature-safety.png"
                alt="Two women travelers feeling safe and confident together"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <span className="inline-flex items-center gap-2 w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <ShieldCheck className="h-4 w-4" />
                Safety built in
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Travel with peace of mind
              </h2>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                We hold every trip to real safety standards, with extra care for women travelers.
              </p>
              <ul className="flex flex-col gap-4">
                <SafetyItem
                  icon={<Users className="h-5 w-5" />}
                  title="Woman-to-woman matching"
                  description="Women can choose to connect and travel only with other verified women."
                />
                <SafetyItem
                  icon={<UserCheck className="h-5 w-5" />}
                  title="Profile verification"
                  description="Verified photos and identity checks so you always know who you're meeting."
                />
                <SafetyItem
                  icon={<Heart className="h-5 w-5" />}
                  title="Trusted community"
                  description="Reviews, reporting tools and emergency contacts keep everyone accountable."
                />
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-20">
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-center flex flex-col items-center gap-6">
            <MessageCircle className="h-10 w-10 text-primary-foreground" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground text-balance max-w-2xl">
              The world is waiting. Don&apos;t explore it alone.
            </h2>
            <p className="text-primary-foreground/80 max-w-xl text-pretty">
              Join a community of travelers ready to share the road with you. Create your free profile in minutes.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create your free profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">TravelBuddy</span>
          </div>
          <p className="text-sm">&copy; 2026 TravelBuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function SafetyItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <li className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </li>
  )
}
