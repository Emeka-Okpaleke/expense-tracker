import { Suspense } from "react"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseFilters } from "@/components/expense-filters"
import { ExpenseExport } from "@/components/expense-export"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExpensesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold">Expenses</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <ExpenseExport />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ExpenseFilters />

        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <ExpenseList />
        </Suspense>
      </div>
    </div>
  )
}

