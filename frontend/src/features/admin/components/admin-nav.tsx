"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { LayoutDashboard, Users, Flag } from "lucide-react"

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: Flag },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 rounded-xl border border-border bg-card/60 p-1 w-fit">
      {items.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
              active
                ? "bg-gradient-to-r from-primary/15 to-accent/15 text-primary ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
