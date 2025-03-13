import { Suspense } from "react"
import { ExpenseSummary } from "@/components/expense-summary"
import { RecentExpenses } from "@/components/recent-expenses"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseCharts } from "@/components/expense-charts"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Expense Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          <ExpenseSummary />
        </Suspense>

        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
          <ExpenseForm />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <ExpenseCharts />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <RecentExpenses />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

