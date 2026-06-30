import { redirect } from "next/navigation"
import { isAdmin } from "@/src/features/auth/current-user"
import { AdminSidebar } from "@/src/features/admin/components/admin-sidebar"

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login")

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
