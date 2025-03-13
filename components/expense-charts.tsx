"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart, ChartContainer, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

export function ExpenseCharts() {
  const [activeTab, setActiveTab] = useState("monthly")
  const [monthlyData, setMonthlyData] = useState([
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 900 },
    { month: "Mar", amount: 1500 },
    { month: "Apr", amount: 1100 },
    { month: "May", amount: 1800 },
    { month: "Jun", amount: 1300 },
    { month: "Jul", amount: 1600 },
    { month: "Aug", amount: 1400 },
    { month: "Sep", amount: 1700 },
    { month: "Oct", amount: 1200 },
    { month: "Nov", amount: 1900 },
    { month: "Dec", amount: 2100 },
  ])
  const [categoryData, setCategoryData] = useState([
    { name: "Food & Dining", value: 1200, color: "#8884d8" },
    { name: "Transportation", value: 900, color: "#83a6ed" },
    { name: "Utilities", value: 800, color: "#8dd1e1" },
    { name: "Entertainment", value: 700, color: "#82ca9d" },
    { name: "Shopping", value: 1500, color: "#a4de6c" },
    { name: "Healthcare", value: 500, color: "#d0ed57" },
    { name: "Travel", value: 600, color: "#ffc658" },
  ])
  const [weeklyData, setWeeklyData] = useState([
    { name: "Mon", amount: 120 },
    { name: "Tue", amount: 90 },
    { name: "Wed", amount: 150 },
    { name: "Thu", amount: 110 },
    { name: "Fri", amount: 180 },
    { name: "Sat", amount: 130 },
    { name: "Sun", amount: 160 },
  ])

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch monthly data
        const monthlyResponse = await fetch("/api/expenses/monthly")
        const monthlyData = await monthlyResponse.json()
        if (Array.isArray(monthlyData) && monthlyData.length > 0) {
          setMonthlyData(monthlyData)
        }

        // Fetch category data
        const categoryResponse = await fetch("/api/expenses/categories")
        const categoryData = await categoryResponse.json()
        if (Array.isArray(categoryData) && categoryData.length > 0) {
          setCategoryData(categoryData)
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
        // Fallback data is already set in state
      }
    }

    fetchData()
  }, [])

  // Custom tooltip component for recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">{`Amount: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Expense Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="h-[350px]">
            <ChartContainer
              config={{
                amount: {
                  label: "Amount ($)",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <Chart>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" fill="var(--color-amount)" name="Amount ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Chart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="weekly" className="h-[350px]">
            <ChartContainer
              config={{
                amount: {
                  label: "Amount ($)",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <Chart>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" name="Amount ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </Chart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="category" className="h-[350px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {categoryData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Chart>
              </ChartContainer>

              <div className="flex items-center justify-center">
                <ChartLegend>
                  {categoryData.map((item: any, index: number) => (
                    <ChartLegendItem key={index} name={item.name} color={item.color} />
                  ))}
                </ChartLegend>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

