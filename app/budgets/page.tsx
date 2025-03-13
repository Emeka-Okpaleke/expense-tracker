import { Suspense } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { BudgetList } from "@/components/budget-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function BudgetsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold">Budgets</h1>
        <Button asChild>
          <Link href="/budgets/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Budget
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <BudgetList />
      </Suspense>
    </div>
  )
}

