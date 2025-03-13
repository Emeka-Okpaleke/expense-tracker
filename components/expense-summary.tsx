import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getExpenseSummary } from "@/lib/data"

export async function ExpenseSummary() {
  const summary = await getExpenseSummary()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.currentMonth.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {summary.monthlyChange >= 0 ? (
              <span className="text-emerald-500">↓ {summary.monthlyChange}% from last month</span>
            ) : (
              <span className="text-rose-500">↑ {Math.abs(summary.monthlyChange)}% from last month</span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.dailyAverage.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Based on last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{summary.topCategory.name}</div>
          <p className="text-xs text-muted-foreground">${summary.topCategory.amount.toFixed(2)} this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Year to Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.yearToDate.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total expenses in {new Date().getFullYear()}</p>
        </CardContent>
      </Card>
    </div>
  )
}

