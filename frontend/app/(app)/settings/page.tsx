"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, Bell, UserCheck, LogOut } from "lucide-react"

const toggles = [
  {
    icon: UserCheck,
    title: "Woman-to-woman matching",
    description: "Only connect with other verified women travelers.",
    defaultOn: false,
  },
  {
    icon: ShieldCheck,
    title: "Verified travelers only",
    description: "Show me people who have completed profile verification.",
    defaultOn: true,
  },
  {
    icon: Bell,
    title: "Push notifications",
    description: "Get notified about new matches and messages.",
    defaultOn: true,
  },
]

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your preferences and safety.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Safety & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {toggles.map((t, i) => {
              const Icon = t.icon
              return (
                <div key={t.title}>
                  {i > 0 && <Separator className="my-1" />}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <Label className="font-medium text-foreground">{t.title}</Label>
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={t.defaultOn} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/profile/create">
              <Button variant="outline" className="w-full justify-start">
                Edit profile details
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
