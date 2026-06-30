"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { Switch } from "@/src/components/ui/switch"
import { Separator } from "@/src/components/ui/separator"
import { ShieldCheck, Bell, UserCheck } from "lucide-react"
import { updateFilters } from "@/src/features/profile/actions"

interface Props {
  isFemale: boolean
  isVerified: boolean
  initialFemaleOnly: boolean
  initialVerifiedOnly: boolean
}

export function SettingsToggles({ isFemale, isVerified, initialFemaleOnly, initialVerifiedOnly }: Props) {
  const [femaleOnly, setFemaleOnly] = useState(initialFemaleOnly)
  const [verifiedOnly, setVerifiedOnly] = useState(initialVerifiedOnly)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function save(nextFemale: boolean, nextVerified: boolean, revert: () => void) {
    setError(null)
    startTransition(async () => {
      const res = await updateFilters(nextFemale, nextVerified)
      if (res.error) {
        setError(res.error)
        revert()
      }
    })
  }

  function toggleFemale(v: boolean) {
    setFemaleOnly(v)
    save(v, verifiedOnly, () => setFemaleOnly(!v))
  }
  function toggleVerified(v: boolean) {
    setVerifiedOnly(v)
    save(femaleOnly, v, () => setVerifiedOnly(!v))
  }

  return (
    <Card className="tint-card">
      <CardHeader>
        <CardTitle className="text-base">Safety &amp; Discover filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Row
          icon={<UserCheck className="h-4 w-4" />}
          title="Woman-to-woman matching"
          description={isFemale ? "Only show me women travelers in Discover." : "Available to female travelers only."}
          checked={femaleOnly}
          disabled={!isFemale}
          onChange={toggleFemale}
        />
        <Separator className="my-1" />
        <Row
          icon={<ShieldCheck className="h-4 w-4" />}
          title="Verified travelers only"
          description={isVerified ? "Only show me people who completed verification." : "Verify your account to use this."}
          checked={verifiedOnly}
          disabled={!isVerified}
          onChange={toggleVerified}
        />
        <Separator className="my-1" />
        <Row
          icon={<Bell className="h-4 w-4" />}
          title="Push notifications"
          description="Get notified about new matches and messages."
          checked
          disabled={false}
          onChange={() => {}}
        />
        {error && <p className="px-1 pt-2 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}

function Row({
  icon, title, description, checked, disabled, onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <Label className="font-medium text-foreground">{title}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  )
}
