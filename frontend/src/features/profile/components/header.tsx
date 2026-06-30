import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Pencil } from "lucide-react"

export default function Header() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold gradient-text">My Profile</h1>
      <Link href="/profile/edit">
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </Link>
    </div>
  )
}
