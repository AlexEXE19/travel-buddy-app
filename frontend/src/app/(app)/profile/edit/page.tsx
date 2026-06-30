import { EditProfileForm } from "@/src/features/profile/components/edit-profile-form"
import { redirect } from "next/navigation"
import { getProfile } from "@/src/features/profile/actions"

export default async function EditProfilePage() {
  const profile= await getProfile()


  if (!profile) redirect("/login")

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <EditProfileForm profile={profile}  />
      </div>
    </div>
  )
}