"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import {
  Compass,
  Flame,
  Plane,
  Map,
  MessageCircle,
  User,
  Settings,
  LogOut,
  CalendarDays,
} from "lucide-react"
import { signoutAndRedirect } from '@/src/actions';
import { useTransition } from "react"

const navItems = [
  { href: "/swipe", label: "Discover", icon: Flame },
  { href: "/trips", label: "Trips", icon: Plane },
  { href: "/map", label: "Map", icon: Map },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppNav() {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signoutAndRedirect();
    });
  }

  return (
    <>
      {/* Top bar (desktop + mobile) */}
      <header className="sticky top-0 z-50 border-b border-border/70 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/swipe" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Compass className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight gradient-text">TravelBuddy</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-gradient-to-r from-primary/15 to-accent/15 text-primary ring-1 ring-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}

            <Link
              href="/calendar"
              className={cn(
                "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all",
                pathname === "/calendar"
                  ? "bg-gradient-to-r from-primary/15 to-accent/15 text-primary ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </Link>
          </nav>

          <Link href="/" className="hidden md:block">
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              {isPending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </Link>
        </div>
      </header>

      {/* Bottom tab bar (mobile) */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border/70 glass md:hidden">
        <div className="grid grid-cols-6">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    active && "bg-gradient-to-br from-primary/15 to-accent/15",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
