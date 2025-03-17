// import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/db"
// import { getMonthlyExpenses } from "@/lib/data"

// export async function GET() {
//   try {
//     await connectToDatabase()
//     const monthlyData = await getMonthlyExpenses()
//     return NextResponse.json(monthlyData)
//   } catch (error) {
//     console.error("Failed to fetch monthly expenses:", error)
//     return NextResponse.json({ error: "Failed to fetch monthly expenses" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getMonthlyExpenses } from "@/lib/data";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const monthlyData = await getMonthlyExpenses();
    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error("Failed to fetch monthly expenses:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch monthly expenses" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
