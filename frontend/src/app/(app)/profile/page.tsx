import { redirect } from "next/navigation"
import { getProfile } from "@/src/features/profile/actions"
import Header from "@/src/features/profile/components/header"
import AvatarCard from "@/src/features/profile/components/avatar-card"
import UserInfo from "@/src/features/profile/components/user-info"

export default async function ProfilePage() {
  const profile = await getProfile()
  if (!profile) redirect("/login")

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-1/3 -left-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-float" />
      <div className="container relative mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-fade-up">
          <Header />
          <AvatarCard profile={profile} />
          <UserInfo profile={profile} />
        </div>
      </div>
    </div>
  )
}
