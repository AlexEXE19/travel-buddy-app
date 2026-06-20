"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateProfile } from "@/actions/updateProfile"

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
]

const nationalityOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
  { value: "in", label: "India" },
  { value: "cn", label: "China" },
  { value: "other", label: "Other" },
]

const subscriptionStatusOptions = [
  { value: "free", label: "Free" },
  { value: "basic", label: "Basic" },
  { value: "premium", label: "Premium" },
  { value: "enterprise", label: "Enterprise" },
]

interface Interest {
  id: string
  name: string
}

interface EditProfileFormProps {
  profile: any
  interests: Interest[]
}

export function EditProfileForm({ profile, interests }: EditProfileFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [bioLength, setBioLength] = useState(profile.bio?.length || 0)

  const [gender, setGender] = useState(profile.gender || "")
  const [nationality, setNationality] = useState(profile.nationality || "")
  const [subscriptionStatus, setSubscriptionStatus] = useState(profile.subscriptionStatus || "free")
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile.interests?.map((i: Interest) => i.id) || []
  )

  function toggleInterest(id: string) {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    formData.append("gender", gender)
    formData.append("nationality", nationality)
    formData.append("subscriptionStatus", subscriptionStatus)
    selectedInterests.forEach(id => formData.append("interests", id))

    const result = await updateProfile(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit}>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              defaultValue={profile.firstName || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              defaultValue={profile.lastName || ""}
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              defaultValue={profile.phone || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              defaultValue={profile.dateOfBirth || ""}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Select value={nationality} onValueChange={setNationality}>
              <SelectTrigger id="nationality">
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                {nationalityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="countryOfResidence">Country of Residence</Label>
            <Input
              id="countryOfResidence"
              name="countryOfResidence"
              placeholder="United States"
              defaultValue={profile.countryOfResidence || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cityOfResidence">City of Residence</Label>
            <Input
              id="cityOfResidence"
              name="cityOfResidence"
              placeholder="New York"
              defaultValue={profile.cityOfResidence || ""}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferred Language</Label>
            <Input
              id="preferredLanguage"
              name="preferredLanguage"
              placeholder="English"
              defaultValue={profile.preferredLanguage || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Travel Budget (USD)</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              placeholder="5000"
              min="0"
              step="100"
              defaultValue={profile.budget || ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
          <Input
            id="profilePictureUrl"
            name="profilePictureUrl"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            defaultValue={profile.profilePictureUrl || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about your travel style..."
            maxLength={1000}
            className="resize-none"
            rows={4}
            defaultValue={profile.bio || ""}
            onChange={(e) => setBioLength(e.target.value.length)}
          />
          <p className="text-xs text-muted-foreground text-right">
            {bioLength}/1000 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscriptionStatus">Subscription Plan</Label>
          <Select value={subscriptionStatus} onValueChange={setSubscriptionStatus}>
            <SelectTrigger id="subscriptionStatus">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              {subscriptionStatusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id)
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                    ${isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                    }`}
                >
                  {interest.name}
                </button>
              )
            })}
          </div>
          {selectedInterests.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedInterests.length} interest{selectedInterests.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </CardContent>

      <CardFooter>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving changes..." : "Save Profile"}
        </Button>
      </CardFooter>
    </form>
  )
}