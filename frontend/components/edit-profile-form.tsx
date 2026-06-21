"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateProfile } from "@/actions/updateProfile"
import { interests } from "@/data/interests"
import { travelTypeOptions } from "@/data/travel-types"
import { Check, Search } from "lucide-react"

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

const climateOptions = [
  { value: "tropical", label: "Tropical & Warm" },
  { value: "temperate", label: "Temperate & Mild" },
  { value: "cold", label: "Cold & Snowy" },
  { value: "desert", label: "Dry & Desert" },
  { value: "mediterranean", label: "Mediterranean" },
]

const transportOptions = [
  { value: "flight", label: "Airplane" },
  { value: "train", label: "Train" },
  { value: "car", label: "Car Rental / Driving" },
  { value: "public", label: "Public Transit" },
  { value: "bicycle", label: "Bicycle / Walking" },
]

const accommodationOptions = [
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel" },
  { value: "apartment", label: "Rental Apartment / Airbnb" },
  { value: "resort", label: "Resort" },
  { value: "camping", label: "Camping / Glamping" },
]

interface EditProfileFormProps {
  profile: any
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [bioLength, setBioLength] = useState(profile.bio?.length || 0)
  const [travelTypeSearch, setTravelTypeSearch] = useState("")

  const [gender, setGender] = useState(profile.gender || "")
  const [nationality, setNationality] = useState(profile.nationality || "")
  const [subscriptionStatus, setSubscriptionStatus] = useState(profile.subscriptionStatus || "free")
  const [preferredTravelTypes, setPreferredTravelTypes] = useState<string[]>(
    profile.preferredTravelType ? profile.preferredTravelType.split(",").filter(Boolean) : [],
  )
  const [preferredClimate, setPreferredClimate] = useState(profile.preferredClimate || "")
  const [preferredTransport, setPreferredTransport] = useState(profile.preferredTransport || "")
  const [preferredAccommodation, setPreferredAccommodation] = useState(profile.preferredAccommodation || "")
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests ? profile.interests.split(",") : [])

  function toggleInterest(id: string) {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  function toggleTravelType(id: string) {
    setPreferredTravelTypes((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    )
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    if (preferredTravelTypes.length < 2) {
      setError("Select at least 2 travel styles")
      setIsLoading(false)
      return
    }

    formData.append("gender", gender)
    formData.append("nationality", nationality)
    formData.append("subscriptionStatus", subscriptionStatus)
    preferredTravelTypes.forEach(type => formData.append("preferredTravelType", type))
    formData.append("preferredClimate", preferredClimate)
    formData.append("preferredTransport", preferredTransport)
    formData.append("preferredAccommodation", preferredAccommodation)
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

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3 sm:col-span-2">
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-1">
                <Label>Preferred Travel Types</Label>
                <p className="text-xs text-muted-foreground">Pick at least 2 styles so matching can be more precise.</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {preferredTravelTypes.length} selected
              </span>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={travelTypeSearch}
                onChange={(event) => setTravelTypeSearch(event.target.value)}
                placeholder="Search travel styles"
                className="pl-9"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {travelTypeOptions
                .filter(option => option.label.toLowerCase().includes(travelTypeSearch.toLowerCase()))
                .map(option => {
                  const isSelected = preferredTravelTypes.includes(option.value)

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleTravelType(option.value)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary"
                      }`}
                    >
                      <span>{option.label}</span>
                      <Check className={`h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                    </button>
                  )
                })}
            </div>

            {preferredTravelTypes.length < 2 ? (
              <p className="text-xs text-muted-foreground">Select at least 2 travel styles.</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredClimate">Preferred Climate</Label>
            <Select value={preferredClimate} onValueChange={setPreferredClimate}>
              <SelectTrigger id="preferredClimate">
                <SelectValue placeholder="Select ideal weather" />
              </SelectTrigger>
              <SelectContent>
                {climateOptions.map(option => (
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
            <Label htmlFor="preferredTransport">Preferred Transportation</Label>
            <Select value={preferredTransport} onValueChange={setPreferredTransport}>
              <SelectTrigger id="preferredTransport">
                <SelectValue placeholder="Select primary transport" />
              </SelectTrigger>
              <SelectContent>
                {transportOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredAccommodation">Preferred Accommodation</Label>
            <Select value={preferredAccommodation} onValueChange={setPreferredAccommodation}>
              <SelectTrigger id="preferredAccommodation">
                <SelectValue placeholder="Select accommodation stay" />
              </SelectTrigger>
              <SelectContent>
                {accommodationOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              const isSelected = selectedInterests.includes(interest)
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                    ${isSelected
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
