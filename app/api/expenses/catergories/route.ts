import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCategoryExpenses } from "@/lib/data"

export async function GET() {
  try {
    await connectToDatabase()
    const categoryData = await getCategoryExpenses()
    return NextResponse.json(categoryData)
  } catch (error) {
    console.error("Failed to fetch category expenses:", error)
    return NextResponse.json({ error: "Failed to fetch category expenses" }, { status: 500 })
  }
}

