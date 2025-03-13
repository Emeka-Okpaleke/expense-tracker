"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { createBudget, updateBudget } from "@/lib/actions"

const categories = [
  { id: "all", name: "All Categories" },
  { id: "food", name: "Food & Dining" },
  { id: "transport", name: "Transportation" },
  { id: "utilities", name: "Utilities" },
  { id: "entertainment", name: "Entertainment" },
  { id: "shopping", name: "Shopping" },
  { id: "health", name: "Healthcare" },
  { id: "travel", name: "Travel" },
  { id: "other", name: "Other" },
]

type BudgetFormProps = {
  budget?: {
    id: string
    name: string
    amount: number
    category: string | null
    startDate: Date
    endDate: Date
  }
}

export function BudgetForm({ budget }: BudgetFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [startDate, setStartDate] = useState<Date>(budget?.startDate || new Date())
  const [endDate, setEndDate] = useState<Date>(budget?.endDate || new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const category = formData.get("category") as string

    try {
      if (budget) {
        // Update existing budget
        await updateBudget(budget.id, {
          name,
          amount,
          category: category === "all" ? null : category,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
      } else {
        // Create new budget
        await createBudget({
          name,
          amount,
          category: category === "all" ? null : category,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
      }

      router.push("/budgets")
      router.refresh()
    } catch (error) {
      console.error("Failed to save budget:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-card rounded-lg shadow-sm p-6 border">
      <div className="space-y-2">
        <Label htmlFor="name">Budget Name</Label>
        <Input id="name" name="name" placeholder="Monthly Expenses" defaultValue={budget?.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Budget Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="pl-7"
            defaultValue={budget?.amount}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={budget?.category || "all"}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select "All Categories" to track spending across all categories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : budget ? "Update Budget" : "Create Budget"}
      </Button>
    </form>
  )
}

