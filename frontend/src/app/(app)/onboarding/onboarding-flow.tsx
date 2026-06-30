"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { updateProfile } from "@/src/features/profile/actions"
import { interests as interestList } from "@/src/features/profile/constants/interests"
import {
  genderOptions,
  preferredTravelTypeOptions,
  preferredClimateOptions,
  preferredTransportOptions,
  preferredAccommodationOptions,
  budgetRangeOptions,
} from "@/src/features/profile/constants/profile-options"

const TOTAL_STEPS = 4

interface StepData {
  // Step 1
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  nationality: string
  gender: string
  // Step 2
  preferredTravelType: string
  preferredClimate: string
  preferredTransport: string
  preferredAccommodation: string
  budgetRange: string
  // Step 3
  interests: string[]
  visitedPlaces: string[]
  bucketListPlaces: string[]
  // Step 4
  profilePictureUrl: string
  bio: string
}

const initialData: StepData = {
  firstName: "", lastName: "", phone: "", dateOfBirth: "", nationality: "", gender: "",
  preferredTravelType: "", preferredClimate: "", preferredTransport: "", preferredAccommodation: "", budgetRange: "",
  interests: [], visitedPlaces: [], bucketListPlaces: [],
  profilePictureUrl: "", bio: "",
}

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<StepData>(initialData)
  const [visitedInput, setVisitedInput] = useState("")
  const [bucketInput, setBucketInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof StepData>(key: K, value: StepData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function toggleInterest(interest: string) {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  function addVisited() {
    const val = visitedInput.replace(/,$/, "").trim()
    if (val && !data.visitedPlaces.includes(val)) {
      setData((prev) => ({ ...prev, visitedPlaces: [...prev.visitedPlaces, val] }))
    }
    setVisitedInput("")
  }

  function addBucket() {
    const val = bucketInput.replace(/,$/, "").trim()
    if (val && !data.bucketListPlaces.includes(val)) {
      setData((prev) => ({ ...prev, bucketListPlaces: [...prev.bucketListPlaces, val] }))
    }
    setBucketInput("")
  }

  function next() { setStep((s) => Math.min(s + 1, TOTAL_STEPS)) }
  function back() { setStep((s) => Math.max(s - 1, 1)) }

  async function finish() {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    if (data.firstName) formData.append("firstName", data.firstName)
    if (data.lastName) formData.append("lastName", data.lastName)
    if (data.phone) formData.append("phone", data.phone)
    if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth)
    if (data.nationality) formData.append("nationality", data.nationality)
    if (data.gender) formData.append("gender", data.gender)
    if (data.preferredTravelType) formData.append("preferredTravelType", data.preferredTravelType)
    if (data.preferredClimate) formData.append("preferredClimate", data.preferredClimate)
    if (data.preferredTransport) formData.append("preferredTransport", data.preferredTransport)
    if (data.preferredAccommodation) formData.append("preferredAccommodation", data.preferredAccommodation)
    if (data.budgetRange) formData.append("budgetRange", data.budgetRange)
    data.interests.forEach((i) => formData.append("interests", i))
    data.visitedPlaces.forEach((p) => formData.append("visitedPlaces", p))
    data.bucketListPlaces.forEach((p) => formData.append("bucketListPlaces", p))
    if (data.profilePictureUrl) formData.append("profilePictureUrl", data.profilePictureUrl)
    if (data.bio) formData.append("bio", data.bio)

    try {
      const result = await updateProfile(formData)
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }
      router.push("/profile")
    } catch {
      // updateProfile may throw redirect — that's fine
    }
  }

  const progressPercent = (step / TOTAL_STEPS) * 100

  const stepMeta = [
    { title: "About you", subtitle: "Let's start with the basics" },
    { title: "Travel style", subtitle: "How do you like to explore?" },
    { title: "Interests & places", subtitle: "What lights you up?" },
    { title: "Your profile", subtitle: "Add a photo and a few words" },
  ][step - 1]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-0 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-float-slow" />

      <div className="relative w-full max-w-md space-y-6 animate-fade-up">
        {/* Welcome header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text">Welcome to TravelBuddy ✨</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A few quick steps to set up your profile — skip anything you like.
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {step} of {TOTAL_STEPS} · {stepMeta.title}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step 1 — About you */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>About you</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="John" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 000 0000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input id="dateOfBirth" type="date" value={data.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" value={data.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="Portuguese" />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select value={data.gender} onValueChange={(v) => set("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Travel style */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Travel style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred travel type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {preferredTravelTypeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("preferredTravelType", opt.value)}
                      className={`rounded-xl border px-3 py-2 text-sm text-left transition-all ${
                        data.preferredTravelType === opt.value
                          ? "border-transparent bg-gradient-to-r from-primary to-accent text-primary-foreground shadow"
                          : "border-border bg-background hover:border-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Climate</Label>
                <Select value={data.preferredClimate} onValueChange={(v) => set("preferredClimate", v)}>
                  <SelectTrigger><SelectValue placeholder="Select climate" /></SelectTrigger>
                  <SelectContent>
                    {preferredClimateOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Transport</Label>
                <Select value={data.preferredTransport} onValueChange={(v) => set("preferredTransport", v)}>
                  <SelectTrigger><SelectValue placeholder="Select transport" /></SelectTrigger>
                  <SelectContent>
                    {preferredTransportOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Accommodation</Label>
                <Select value={data.preferredAccommodation} onValueChange={(v) => set("preferredAccommodation", v)}>
                  <SelectTrigger><SelectValue placeholder="Select accommodation" /></SelectTrigger>
                  <SelectContent>
                    {preferredAccommodationOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Budget style</Label>
                <Select value={data.budgetRange} onValueChange={(v) => set("budgetRange", v)}>
                  <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                  <SelectContent>
                    {budgetRangeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Interests & places */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Interests &amp; places</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interestList.map((interest) => {
                    const selected = data.interests.includes(interest)
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          selected
                            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground border-transparent shadow"
                            : "bg-background text-foreground border-border hover:border-primary"
                        }`}
                      >
                        {interest}
                      </button>
                    )
                  })}
                </div>
                {data.interests.length > 0 && (
                  <p className="text-xs text-muted-foreground">{data.interests.length} selected</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Places visited</Label>
                <Input
                  value={visitedInput}
                  onChange={(e) => setVisitedInput(e.target.value)}
                  placeholder="e.g. Tokyo, Japan"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addVisited() }
                  }}
                />
                {data.visitedPlaces.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {data.visitedPlaces.map((p) => (
                      <span key={p} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs">
                        📍 {p}
                        <button type="button" onClick={() => setData((prev) => ({ ...prev, visitedPlaces: prev.visitedPlaces.filter((x) => x !== p) }))} className="hover:text-destructive">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
              </div>

              <div className="space-y-2">
                <Label>Bucket list</Label>
                <Input
                  value={bucketInput}
                  onChange={(e) => setBucketInput(e.target.value)}
                  placeholder="e.g. Machu Picchu, Peru"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addBucket() }
                  }}
                />
                {data.bucketListPlaces.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {data.bucketListPlaces.map((p) => (
                      <span key={p} className="flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 px-2.5 py-0.5 text-xs">
                        ⭐ {p}
                        <button type="button" onClick={() => setData((prev) => ({ ...prev, bucketListPlaces: prev.bucketListPlaces.filter((x) => x !== p) }))} className="hover:text-destructive">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 — Your profile */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Your profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="profilePictureUrl">Profile picture URL</Label>
                <Input
                  id="profilePictureUrl"
                  type="url"
                  value={data.profilePictureUrl}
                  onChange={(e) => set("profilePictureUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Tell us about your travel style…"
                  maxLength={1000}
                  className="resize-none"
                  rows={5}
                />
                <p className="text-xs text-muted-foreground text-right">{data.bio.length}/1000</p>
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={back} className="flex-1">
              Back
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <>
              <Button variant="ghost" onClick={next} className="flex-1">
                Skip
              </Button>
              <Button onClick={next} className="flex-1">
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/profile")} className="flex-1">
                Skip
              </Button>
              <Button onClick={finish} disabled={isLoading} className="flex-1">
                {isLoading ? "Saving…" : "Finish"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
