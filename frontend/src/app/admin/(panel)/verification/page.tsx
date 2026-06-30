import { getAdminProfiles } from "@/src/features/admin/actions"
import { VerificationGrid } from "@/src/features/admin/components/verification-grid"

export default async function AdminVerificationPage() {
  const profiles = await getAdminProfiles()
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Verification</h2>
        <p className="text-sm text-muted-foreground">
          Inspect each profile (including the photo) and verify it. New accounts start unverified.
        </p>
      </div>
      <VerificationGrid initial={profiles ?? []} />
    </div>
  )
}
