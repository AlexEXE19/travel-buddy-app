import { getAdminUsers } from "@/src/features/admin/actions"
import { UsersTable } from "@/src/features/admin/components/users-table"

export default async function AdminUsersPage() {
  const users = await getAdminUsers()
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground">
          Suspend or ban accounts. Banned and suspended users cannot log in.
        </p>
      </div>
      <UsersTable initialUsers={users ?? []} />
    </div>
  )
}
