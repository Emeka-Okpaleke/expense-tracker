import { formatDistanceToNow, format } from "date-fns"
import { getExpenses } from "@/lib/data"
import { DeleteExpenseButton } from "@/components/delete-expense-button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export async function ExpenseList({
  startDate,
  endDate,
  category,
}: {
  startDate?: Date
  endDate?: Date
  category?: string
}) {
  const filter = {
    startDate,
    endDate,
    category,
  }

  const expenses = await getExpenses(filter)

  if (expenses.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No expenses found. Add some expenses to see them here.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense._id.toString()}>
              <TableCell>
                <div className="font-medium">{format(new Date(expense.date), "MMM d, yyyy")}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
                </div>
              </TableCell>
              <TableCell>{expense.description || "Unnamed expense"}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {expense.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">${expense.amount.toFixed(2)}</TableCell>
              <TableCell>
                <DeleteExpenseButton id={expense._id.toString()} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

