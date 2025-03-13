"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

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

export function ExpenseFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate") as string) : undefined,
      endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate") as string) : undefined,
      category: searchParams.get("category") || "all",
    },
  })

  function onSubmit(data: any) {
    startTransition(() => {
      const params = new URLSearchParams()

      if (data.startDate) {
        params.set("startDate", data.startDate.toISOString())
      }

      if (data.endDate) {
        params.set("endDate", data.endDate.toISOString())
      }

      if (data.category && data.category !== "all") {
        params.set("category", data.category)
      }

      router.push(`/expenses?${params.toString()}`)
    })
  }

  function handleReset() {
    form.reset({
      startDate: undefined,
      endDate: undefined,
      category: "all",
    })

    router.push("/expenses")
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border">
      <h2 className="text-xl font-semibold mb-4">Filter Expenses</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Filtering..." : "Apply Filters"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

