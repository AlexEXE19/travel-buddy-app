"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { CardContent, CardFooter } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { updateProfile } from "../actions"
import { interests as interestList } from "@/src/features/profile/constants/interests"
import {
  genderOptions,
  preferredTravelTypeOptions,
  preferredClimateOptions,
  preferredTransportOptions,
  preferredAccommodationOptions,
  budgetRangeOptions,
} from "@/src/features/profile/constants/profile-options"
import type { UserProfile } from "@/src/types/profile"

interface EditProfileFormProps {
  profile: UserProfile
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [bioLength, setBioLength] = useState(profile.bio?.length ?? 0)

  const [gender, setGender] = useState(profile.gender ?? "")
  const [preferredTravelType, setPreferredTravelType] = useState(profile.preferredTravelType ?? "")
  const [preferredClimate, setPreferredClimate] = useState(profile.preferredClimate ?? "")
  const [preferredTransport, setPreferredTransport] = useState(profile.preferredTransport ?? "")
  const [preferredAccommodation, setPreferredAccommodation] = useState(profile.preferredAccommodation ?? "")
  const [budgetRange, setBudgetRange] = useState(profile.budgetRange ?? "")
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests ?? [])
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>(profile.visitedPlaces ?? [])
  const [bucketListPlaces, setBucketListPlaces] = useState<string[]>(profile.bucketListPlaces ?? [])
  const [visitedInput, setVisitedInput] = useState("")
  const [bucketInput, setBucketInput] = useState("")

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    if (gender) formData.append("gender", gender)
    if (preferredTravelType) formData.append("preferredTravelType", preferredTravelType)
    if (preferredClimate) formData.append("preferredClimate", preferredClimate)
    if (preferredTransport) formData.append("preferredTransport", preferredTransport)
    if (preferredAccommodation) formData.append("preferredAccommodation", preferredAccommodation)
    if (budgetRange) formData.append("budgetRange", budgetRange)
    selectedInterests.forEach((i) => formData.append("interests", i))
    visitedPlaces.forEach((p) => formData.append("visitedPlaces", p))
    bucketListPlaces.forEach((p) => formData.append("bucketListPlaces", p))

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
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" name="firstName" placeholder="John" defaultValue={profile.firstName ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" name="lastName" placeholder="Doe" defaultValue={profile.lastName ?? ""} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1 555 000 0000" defaultValue={profile.phone ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={profile.dateOfBirth ?? ""} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                {genderOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" name="nationality" placeholder="Portuguese" defaultValue={profile.nationality ?? ""} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="countryOfResidence">Country</Label>
            <Input id="countryOfResidence" name="countryOfResidence" placeholder="Portugal" defaultValue={profile.countryOfResidence ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cityOfResidence">City</Label>
            <Input id="cityOfResidence" name="cityOfResidence" placeholder="Lisbon" defaultValue={profile.cityOfResidence ?? ""} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Language</Label>
            <Input id="preferredLanguage" name="preferredLanguage" placeholder="English" defaultValue={profile.preferredLanguage ?? ""} />
          </div>
          <div className="space-y-2">
            <Label>Budget style</Label>
            <Select value={budgetRange} onValueChange={setBudgetRange}>
              <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
              <SelectContent>
                {budgetRangeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preferred travel type</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {preferredTravelTypeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPreferredTravelType(opt.value)}
                className={`rounded-xl border px-3 py-2 text-sm text-left transition-colors ${
                  preferredTravelType === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Climate</Label>
            <Select value={preferredClimate} onValueChange={setPreferredClimate}>
              <SelectTrigger><SelectValue placeholder="Select climate" /></SelectTrigger>
              <SelectContent>
                {preferredClimateOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Transport</Label>
            <Select value={preferredTransport} onValueChange={setPreferredTransport}>
              <SelectTrigger><SelectValue placeholder="Select transport" /></SelectTrigger>
              <SelectContent>
                {preferredTransportOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Accommodation</Label>
            <Select value={preferredAccommodation} onValueChange={setPreferredAccommodation}>
              <SelectTrigger><SelectValue placeholder="Select accommodation" /></SelectTrigger>
              <SelectContent>
                {preferredAccommodationOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profilePictureUrl">Profile picture URL</Label>
          <Input id="profilePictureUrl" name="profilePictureUrl" type="url" placeholder="https://..." defaultValue={profile.profilePictureUrl ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio" name="bio" placeholder="Tell us about your travel style…"
            maxLength={1000} className="resize-none" rows={4}
            defaultValue={profile.bio ?? ""}
            onChange={(e) => setBioLength(e.target.value.length)}
          />
          <p className="text-xs text-muted-foreground text-right">{bioLength}/1000</p>
        </div>

        <div className="space-y-3">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interestList.map((interest) => {
              const selected = selectedInterests.includes(interest)
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                  }`}
                >
                  {interest}
                </button>
              )
            })}
          </div>
          {selectedInterests.length > 0 && (
            <p className="text-xs text-muted-foreground">{selectedInterests.length} selected</p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Places visited</Label>
          <div className="flex gap-2">
            <Input
              value={visitedInput}
              onChange={(e) => setVisitedInput(e.target.value)}
              placeholder="e.g. Tokyo, Japan"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault()
                  const val = visitedInput.replace(/,$/, "").trim()
                  if (val && !visitedPlaces.includes(val)) {
                    setVisitedPlaces((prev) => [...prev, val])
                  }
                  setVisitedInput("")
                }
              }}
            />
          </div>
          {visitedPlaces.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visitedPlaces.map((place) => (
                <span key={place} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  📍 {place}
                  <button
                    type="button"
                    onClick={() => setVisitedPlaces((prev) => prev.filter((p) => p !== place))}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${place}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Press Enter or comma to add a place</p>
        </div>

        <div className="space-y-3">
          <Label>Bucket list</Label>
          <div className="flex gap-2">
            <Input
              value={bucketInput}
              onChange={(e) => setBucketInput(e.target.value)}
              placeholder="e.g. Machu Picchu, Peru"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault()
                  const val = bucketInput.replace(/,$/, "").trim()
                  if (val && !bucketListPlaces.includes(val)) {
                    setBucketListPlaces((prev) => [...prev, val])
                  }
                  setBucketInput("")
                }
              }}
            />
          </div>
          {bucketListPlaces.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {bucketListPlaces.map((place) => (
                <span key={place} className="flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 px-3 py-1 text-xs font-medium">
                  ⭐ {place}
                  <button
                    type="button"
                    onClick={() => setBucketListPlaces((prev) => prev.filter((p) => p !== place))}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${place}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Press Enter or comma to add a place</p>
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}
      </CardContent>

      <CardFooter>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Save profile"}
        </Button>
      </CardFooter>
    </form>
  )
}
