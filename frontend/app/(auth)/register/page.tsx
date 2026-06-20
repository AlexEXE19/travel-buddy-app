import { RegisterForm } from "@/components/register-form"
import { AuthBrandPanel } from "@/components/auth-brand-panel"
import { Compass } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="flex flex-col">
        <header className="p-6">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Compass className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">TravelBuddy</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
              <p className="text-muted-foreground mt-2">Start finding your travel companions today.</p>
            </div>

            <RegisterForm />

            <p className="text-sm text-muted-foreground text-center mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}