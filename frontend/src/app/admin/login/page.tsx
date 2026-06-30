import Link from "next/link"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import { isAdmin } from "@/src/features/auth/current-user"
import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/src/features/admin/components/admin-login-form"

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin")

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-2xl font-bold gradient-text">TravelBuddy Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Restricted area — administrators only.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
          <AdminLoginForm />
        </div>

        <Link
          href="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to TravelBuddy
        </Link>
      </div>
    </div>
  )
}
