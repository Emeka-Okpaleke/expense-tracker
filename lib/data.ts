import { connectToDatabase } from "./db"
import Expense from "@/models/expense"
import Budget from "@/models/budget"
import { startOfMonth, endOfMonth, startOfYear, subMonths } from "date-fns"

export type ExpenseFilter = {
  startDate?: Date
  endDate?: Date
  category?: string
  minAmount?: number
  maxAmount?: number
}

export async function getExpenseSummary() {
  await connectToDatabase()

  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)
  const previousMonthStart = startOfMonth(subMonths(now, 1))
  const previousMonthEnd = endOfMonth(subMonths(now, 1))
  const yearStart = startOfYear(now)

  // Current month total
  const currentMonthExpenses = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: currentMonthStart,
          $lte: currentMonthEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ])

  // Previous month total
  const previousMonthExpenses = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ])

  // Year to date total
  const yearToDateExpenses = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: yearStart,
          $lte: now,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ])

  // Top category this month
  const categoryExpenses = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: currentMonthStart,
          $lte: currentMonthEnd,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { total: -1 },
    },
    {
      $limit: 1,
    },
  ])

  // Calculate daily average
  const daysPassed = Math.max(1, now.getDate())
  const currentMonthTotal = currentMonthExpenses[0]?.total || 0
  const dailyAverage = currentMonthTotal / daysPassed

  // Calculate monthly change percentage
  const previousMonthTotal = previousMonthExpenses[0]?.total || 0
  let monthlyChange = 0

  if (previousMonthTotal > 0) {
    monthlyChange = ((previousMonthTotal - currentMonthTotal) / previousMonthTotal) * 100
  }

  return {
    currentMonth: currentMonthTotal,
    previousMonth: previousMonthTotal,
    monthlyChange: Number.parseFloat(monthlyChange.toFixed(2)),
    dailyAverage: Number.parseFloat(dailyAverage.toFixed(2)),
    yearToDate: yearToDateExpenses[0]?.total || 0,
    topCategory: {
      name: categoryExpenses[0]?._id || "none",
      amount: categoryExpenses[0]?.total || 0,
    },
  }
}

export async function getRecentExpenses(limit = 5) {
  await connectToDatabase()

  return Expense.find().sort({ date: -1 }).limit(limit)
}

export async function getExpenses(filter?: ExpenseFilter) {
  await connectToDatabase()

  const query: any = {}

  if (filter) {
    if (filter.startDate || filter.endDate) {
      query.date = {}

      if (filter.startDate) {
        query.date.$gte = filter.startDate
      }

      if (filter.endDate) {
        query.date.$lte = filter.endDate
      }
    }

    if (filter.category) {
      query.category = filter.category
    }

    if (filter.minAmount || filter.maxAmount) {
      query.amount = {}

      if (filter.minAmount) {
        query.amount.$gte = filter.minAmount
      }

      if (filter.maxAmount) {
        query.amount.$lte = filter.maxAmount
      }
    }
  }

  return Expense.find(query).sort({ date: -1 })
}

export async function getMonthlyExpenses() {
  await connectToDatabase()

  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const yearEnd = new Date(now.getFullYear(), 11, 31)

  const expenses = await Expense.find({
    date: {
      $gte: yearStart,
      $lte: yearEnd,
    },
  }).lean()

  // Group by month
  const monthlyData = Array(12)
    .fill(0)
    .map((_, i) => ({
      month: new Date(now.getFullYear(), i, 1).toLocaleString("default", { month: "short" }),
      amount: 0,
    }))

  expenses.forEach((expense: any) => {
    const month = new Date(expense.date).getMonth()
    monthlyData[month].amount += expense.amount
  })

  return monthlyData
}

export async function getCategoryExpenses() {
  await connectToDatabase()

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const categoryExpenses = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
  ])

  // Define colors for categories
  const colors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658", "#ff8042"]

  return categoryExpenses.map((item, index) => ({
    name: item._id,
    value: item.total,
    color: colors[index % colors.length],
  }))
}

export async function getBudgets() {
  await connectToDatabase()

  return Budget.find().sort({ endDate: -1 })
}

export async function getBudgetById(id: string) {
  await connectToDatabase()

  return Budget.findById(id)
}

export async function getBudgetProgress(budgetId: string) {
  await connectToDatabase()

  const budget = await Budget.findById(budgetId)

  if (!budget) {
    return { budget: null, spent: 0, remaining: 0, percentage: 0 }
  }

  const query: any = {
    date: {
      $gte: budget.startDate,
      $lte: budget.endDate,
    },
  }

  if (budget.category) {
    query.category = budget.category
  }

  const expenses = await Expense.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ])

  const spent = expenses[0]?.total || 0
  const remaining = Math.max(0, budget.amount - spent)
  const percentage = Math.min(100, (spent / budget.amount) * 100)

  return {
    budget,
    spent,
    remaining,
    percentage,
  }
}

