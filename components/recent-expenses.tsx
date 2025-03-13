import { formatDistanceToNow } from "date-fns"
import { getRecentExpenses } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export async function RecentExpenses() {
  const expenses = await getRecentExpenses()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No recent expenses</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} className="flex items-start justify-between pb-4 border-b">
                <div className="space-y-1">
                  <p className="font-medium">{expense.description || "Unnamed expense"}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {expense.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <p className="font-semibold">${expense.amount.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

