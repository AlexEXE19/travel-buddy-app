import Image from "next/image"
import { Sparkles, ShieldCheck, Users, Compass } from "lucide-react"

export function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-accent p-10 text-primary-foreground">
      <Image
        src="/images/hero-travelers.png"
        alt=""
        fill
        className="object-cover opacity-15 mix-blend-overlay"
        aria-hidden="true"
      />
      {/* Floating orbs */}
      <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/15 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl animate-float-slow" />

      <div className="relative flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <Compass className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold tracking-tight">TravelBuddy</span>
      </div>

      <div className="relative">
        <h2 className="text-4xl font-bold text-balance leading-tight">
          Your next adventure is one connection away.
        </h2>
        <p className="mt-4 text-primary-foreground/85 text-pretty max-w-sm">
          Join travelers who explore the world together, safely and with a guide in their pocket.
        </p>
      </div>
      <ul className="relative flex flex-col gap-4">
        <Highlight icon={<Users className="h-5 w-5" />} text="Match on shared interests" />
        <Highlight icon={<ShieldCheck className="h-5 w-5" />} text="Verified, safety-first community" />
        <Highlight icon={<Sparkles className="h-5 w-5" />} text="AI guide for every trip" />
      </ul>
    </div>
  )
}

function Highlight({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
        {icon}
      </span>
      <span className="font-medium">{text}</span>
    </li>
  )
}
