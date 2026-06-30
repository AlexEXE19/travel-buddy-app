import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
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
  Instagram,
  Twitter,
  Facebook,
  Mail,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/70 glass">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Compass className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight gradient-text">TravelBuddy</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-primary to-accent">Sign up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Floating ambient orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="pointer-events-none absolute top-20 right-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-float-slow" />

          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6 animate-fade-up">
                <span className="inline-flex items-center gap-2 w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                  <Sparkles className="h-4 w-4" />
                  Your adventure starts with the right people
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-balance leading-[1.05]">
                  Find your <span className="gradient-text">people</span>.
                  <br />
                  Then find the <span className="gradient-text">world</span>.
                </h1>
                <p className="text-lg text-muted-foreground text-pretty max-w-xl leading-relaxed">
                  TravelBuddy matches you with travelers who share your interests, keeps you safe along the way, and
                  guides every step of the journey. Adventure is better together.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20">
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
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
                <Image
                  src="/images/hero-travelers.png"
                  alt="A group of happy travelers enjoying a scenic overlook together"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
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
              <article className="card-hover flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
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
              <article className="card-hover flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
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
              <article className="card-hover flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
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
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-accent rounded-3xl p-10 md:p-16 text-center flex flex-col items-center gap-6">
            <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <MessageCircle className="relative h-10 w-10 text-primary-foreground" />
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
      <footer className="border-t border-border bg-card/40">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-5">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <Compass className="h-5 w-5" />
                </span>
                <span className="text-xl font-bold gradient-text">TravelBuddy</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Find travelers who share your interests, plan trips together, and explore the world — safely.
              </p>
              <div className="mt-4 flex gap-3 text-muted-foreground">
                <a href="#" aria-label="Instagram" className="transition-colors hover:text-primary"><Instagram className="h-5 w-5" /></a>
                <a href="#" aria-label="Twitter" className="transition-colors hover:text-primary"><Twitter className="h-5 w-5" /></a>
                <a href="#" aria-label="Facebook" className="transition-colors hover:text-primary"><Facebook className="h-5 w-5" /></a>
                <a href="mailto:hello@travelbuddy.dev" aria-label="Email" className="transition-colors hover:text-primary"><Mail className="h-5 w-5" /></a>
              </div>
            </div>

            <FooterCol title="Product" links={["Discover", "Trips", "World map", "Premium"]} />
            <FooterCol title="Company" links={["About us", "Careers", "Blog", "Press"]} />
            <FooterCol title="Support" links={["Help center", "Safety", "Contact", "Community"]} />
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">&copy; 2026 TravelBuddy. All rights reserved.</p>
            <div className="flex gap-5 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {l}
            </a>
          </li>
        ))}
      </ul>
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
