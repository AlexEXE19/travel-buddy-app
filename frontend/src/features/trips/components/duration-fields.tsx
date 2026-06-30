"use client"

import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { durationUnitOptions } from "@/src/features/trips/constants/trip-form"

export function DurationFields({
  amount,
  unit,
  onAmountChange,
  onUnitChange,
}: {
  amount: string
  unit: "hours" | "days"
  onAmountChange: (value: string) => void
  onUnitChange: (value: "hours" | "days") => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
      <div className="space-y-2">
        <Label>Time spent</Label>
        <Input
          type="number"
          min="1"
          placeholder="Optional"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Unit</Label>
        <Select value={unit} onValueChange={(value) => onUnitChange(value as "hours" | "days")}>
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {durationUnitOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
