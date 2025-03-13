import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { getBudgetById, getBudgetProgress } from "@/lib/data"
import { BudgetForm } from "@/components/budget-form"
import { ExpenseList } from "@/components/expense-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function BudgetPage({ params }: { params: { id: string } }) {
  const budget = await getBudgetById(params.id)

  if (!budget) {
    notFound()
  }

  const progress = await getBudgetProgress(budget._id.toString())
  const isOverBudget = progress.percentage >= 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">{budget.name}</h1>
          <p className="text-muted-foreground">
            {format(new Date(budget.startDate), "MMM d")} - {format(new Date(budget.endDate), "MMM d, yyyy")}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/budgets">Back to Budgets</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">${progress.spent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">of ${budget.amount.toFixed(2)} budget</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${isOverBudget ? "text-destructive" : "text-emerald-500"}`}>
                    {isOverBudget
                      ? `$${(progress.spent - budget.amount).toFixed(2)} over`
                      : `$${progress.remaining.toFixed(2)} remaining`}
                  </p>
                  <p className="text-sm text-muted-foreground">{progress.percentage.toFixed(0)}% used</p>
                </div>
              </div>

              <Progress
                value={progress.percentage}
                className={isOverBudget ? "bg-destructive/20" : ""}
                indicatorClassName={isOverBudget ? "bg-destructive" : ""}
              />

              {budget.category && (
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Category:</span>
                  <Badge variant="outline" className="capitalize">
                    {budget.category}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Budget Amount</dt>
                <dd className="text-lg font-semibold">${budget.amount.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                <dd className="text-lg">{format(new Date(budget.startDate), "MMMM d, yyyy")}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">End Date</dt>
                <dd className="text-lg">{format(new Date(budget.endDate), "MMMM d, yyyy")}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                <dd className="text-lg capitalize">{budget.category || "All Categories"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList>
          <TabsTrigger value="expenses">Related Expenses</TabsTrigger>
          <TabsTrigger value="edit">Edit Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses" className="mt-6">
          <ExpenseList
            startDate={new Date(budget.startDate)}
            endDate={new Date(budget.endDate)}
            category={budget.category || undefined}
          />
        </TabsContent>
        <TabsContent value="edit" className="mt-6">
          <BudgetForm budget={budget} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

