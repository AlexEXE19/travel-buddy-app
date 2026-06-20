import Image from "next/image"
import { Sparkles, ShieldCheck, Users } from "lucide-react"

export function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground">
      <Image
        src="/images/hero-travelers.png"
        alt=""
        fill
        className="object-cover opacity-20"
        aria-hidden="true"
      />
      <div className="relative">
        <h2 className="text-3xl font-bold text-balance leading-tight">
          Your next adventure is one connection away.
        </h2>
        <p className="mt-4 text-primary-foreground/80 text-pretty max-w-sm">
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
