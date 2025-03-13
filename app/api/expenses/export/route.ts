import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Expense from "@/models/expense"
import { format } from "date-fns"

export async function GET(request: NextRequest) {
  await connectToDatabase()

  const searchParams = request.nextUrl.searchParams
  const exportFormat = searchParams.get("format") || "csv"

  try {
    const expenses = await Expense.find().sort({ date: -1 })

    if (exportFormat === "json") {
      // Format the data for JSON export
      const formattedExpenses = expenses.map((expense: any) => ({
        id: expense._id.toString(),
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: format(new Date(expense.date), "yyyy-MM-dd"),
        createdAt: format(new Date(expense.createdAt), "yyyy-MM-dd HH:mm:ss"),
      }))

      return NextResponse.json(formattedExpenses)
    } else {
      // Format the data for CSV export
      const headers = ["Date", "Category", "Description", "Amount"]
      const rows = expenses.map((expense: any) => [
        format(new Date(expense.date), "yyyy-MM-dd"),
        expense.category,
        expense.description || "",
        expense.amount.toString(),
      ])

      const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="expenses-${format(new Date(), "yyyy-MM-dd")}.csv"`,
        },
      })
    }
  } catch (error) {
    console.error("Failed to export expenses:", error)
    return new NextResponse("Failed to export expenses", { status: 500 })
  }
}

