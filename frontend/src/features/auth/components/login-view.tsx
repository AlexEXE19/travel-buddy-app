import { LoginForm } from "@/src/features/auth/components/login-form"
import { AuthBrandPanel } from "@/src/features/auth/components/auth-brand-panel"
import { Compass } from "lucide-react"
import Link from "next/link"

export default function LoginView() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="flex flex-col">
        <header className="p-6">
          <Link href="/" className="flex items-center gap-2 w-fit group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Compass className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight gradient-text">TravelBuddy</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
              <p className="text-muted-foreground mt-2">Sign in to continue your journey.</p>
            </div>

            <LoginForm />

            <p className="text-sm text-muted-foreground text-center mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}