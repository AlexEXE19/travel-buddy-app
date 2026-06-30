"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/src/lib/utils"
import { signoutAndRedirect } from "@/src/actions"
import { LayoutDashboard, Users, Flag, LogOut, ShieldCheck, ExternalLink, BadgeCheck } from "lucide-react"

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/verification", label: "Verification", icon: BadgeCheck },
  { href: "/admin/reports", label: "Reports", icon: Flag },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card/70 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold gradient-text leading-none">TravelBuddy</p>
          <p className="text-[11px] text-muted-foreground">Admin panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-primary/15 to-accent/15 text-primary ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <Link
          href="/swipe"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" /> Open the app
        </Link>
        <button
          onClick={() => startTransition(() => { signoutAndRedirect() })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  )
}
