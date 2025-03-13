"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "./db"
import Expense from "@/models/expense"
import Budget from "@/models/budget"

type ExpenseData = {
  amount: number
  category: string
  description: string
  date: string
}

type BudgetData = {
  name: string
  amount: number
  category: string | null
  startDate: string
  endDate: string
}

export async function addExpense(data: ExpenseData) {
  try {
    await connectToDatabase()

    const expense = new Expense({
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
    })

    await expense.save()

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to add expense:", error)
    return { success: false, error: "Failed to add expense" }
  }
}

export async function createBudget(data: BudgetData) {
  try {
    await connectToDatabase()

    const budget = new Budget({
      name: data.name,
      amount: data.amount,
      category: data.category,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    })

    await budget.save()

    revalidatePath("/budgets")
    return { success: true }
  } catch (error) {
    console.error("Failed to create budget:", error)
    return { success: false, error: "Failed to create budget" }
  }
}

export async function updateBudget(id: string, data: BudgetData) {
  try {
    await connectToDatabase()

    await Budget.findByIdAndUpdate(id, {
      name: data.name,
      amount: data.amount,
      category: data.category,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    })

    revalidatePath("/budgets")
    return { success: true }
  } catch (error) {
    console.error("Failed to update budget:", error)
    return { success: false, error: "Failed to update budget" }
  }
}

export async function deleteExpense(id: string) {
  try {
    await connectToDatabase()

    await Expense.findByIdAndDelete(id)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete expense:", error)
    return { success: false, error: "Failed to delete expense" }
  }
}

