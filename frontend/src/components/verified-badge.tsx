import { BadgeCheck } from "lucide-react"
import { cn } from "@/src/lib/utils"

/** Blue verified checkmark shown next to a verified user's name. */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span title="Verified account" className="inline-flex">
      <BadgeCheck className={cn("h-4 w-4 text-sky-500", className)} aria-label="Verified" />
    </span>
  )
}
