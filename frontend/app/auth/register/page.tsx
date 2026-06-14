
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass } from "lucide-react"
import RegisterForm from "../components/RegisterForm"
export default function RegisterPage() {


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Compass className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">TravelBuddy</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Join TravelBuddy and start finding travel companions
            </CardDescription>
          </CardHeader>
        <RegisterForm></RegisterForm>
        </Card>
      </main>
    </div>
  )
}
