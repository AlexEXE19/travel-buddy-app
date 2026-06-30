"use client"

import { useState, useTransition } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { setUserStatus } from "@/src/features/admin/actions"
import type { AdminUser, AccountStatus } from "@/src/types/admin"
import { cn } from "@/src/lib/utils"

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  SUSPENDED: "bg-amber-500/10 text-amber-700 border-amber-200",
  BANNED: "bg-red-500/10 text-red-700 border-red-200",
}

export function UsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function change(id: string, status: AccountStatus) {
    setPendingId(id)
    startTransition(async () => {
      const res = await setUserStatus(id, status)
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, accountStatus: status } : u)))
      }
      setPendingId(null)
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Set status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                No users.
              </TableCell>
            </TableRow>
          )}
          {users.map((u) => (
            <TableRow key={u.id} className={cn(pendingId === u.id && "opacity-50")}>
              <TableCell className="font-medium">{u.email}</TableCell>
              <TableCell>
                <Badge variant={u.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                  {u.role ?? "USER"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={cn("border text-xs", STATUS_STYLES[u.accountStatus ?? "ACTIVE"])}>
                  {u.accountStatus ?? "ACTIVE"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell className="text-right">
                <Select
                  value={u.accountStatus ?? "ACTIVE"}
                  onValueChange={(v) => change(u.id, v as AccountStatus)}
                  disabled={u.role === "ADMIN"}
                >
                  <SelectTrigger className="h-8 w-[140px] ml-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspend</SelectItem>
                    <SelectItem value="BANNED">Ban</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
