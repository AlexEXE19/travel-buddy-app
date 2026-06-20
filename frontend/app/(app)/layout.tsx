import { AppNav } from "@/components/app-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      {/* pb-20 leaves room for the mobile bottom tab bar */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  )
}
