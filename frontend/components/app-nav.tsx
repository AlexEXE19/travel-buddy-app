"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Compass,
  Flame,
  Plane,
  MessageCircle,
  User,
  Settings,
  LogOut,
  CalendarDays,
} from "lucide-react"
import { signoutAndRedirect } from '@/actions/signout';
import { useTransition } from "react"
import { calendarTrips } from "@/data/trips-showcase"

const navItems = [
  { href: "/swipe", label: "Discover", icon: Flame },
  { href: "/trips", label: "Trips", icon: Plane },
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/swipe" className="flex items-center gap-2">
            <Compass className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">TravelBuddy</span>
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
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-1 gap-2 text-muted-foreground hover:text-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Calendar
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-96 p-0">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">Trip calendar</p>
                  <p className="text-xs text-muted-foreground">A quick look at your upcoming and current routes.</p>
                </div>

                <div className="max-h-96 overflow-auto p-3">
                  <div className="space-y-3">
                    {calendarTrips.map((trip) => (
                      <Link
                        key={trip.id}
                        href="/trips"
                        className="block rounded-xl border p-3 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{trip.title}</p>
                            <p className="text-xs text-muted-foreground">{trip.destination}</p>
                          </div>
                          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                            {trip.dates}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
