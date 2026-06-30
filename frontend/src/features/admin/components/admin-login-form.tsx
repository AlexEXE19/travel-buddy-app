"use client"

import { useActionState } from "react"
import { adminLogin, type AdminLoginState } from "@/src/features/admin/login-action"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState<AdminLoginState, FormData>(adminLogin, {})

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="admin@travelbuddy.dev" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full bg-gradient-to-r from-primary to-accent">
        {pending ? "Signing in…" : "Sign in to admin"}
      </Button>
    </form>
  )
}
