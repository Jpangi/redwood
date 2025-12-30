"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingDown, ArrowUp, ArrowDown } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

const monthlySpending = [
  { month: "Jan", amount: 2145 },
  { month: "Feb", amount: 2340 },
  { month: "Mar", amount: 2089 },
  { month: "Apr", amount: 2567 },
  { month: "May", amount: 2234 },
  { month: "Jun", amount: 2145 },
]

const categoryBreakdown = [
  { name: "Food & Dining", value: 387.45, color: "hsl(var(--chart-1))" },
  { name: "Shopping", value: 245.67, color: "hsl(var(--chart-2))" },
  { name: "Housing", value: 1200.0, color: "hsl(var(--chart-3))" },
  { name: "Transport", value: 152.3, color: "hsl(var(--chart-4))" },
  { name: "Entertainment", value: 98.75, color: "hsl(var(--chart-5))" },
]

const weeklySpending = [
  { day: "Mon", amount: 45.2 },
  { day: "Tue", amount: 67.8 },
  { day: "Wed", amount: 34.5 },
  { day: "Thu", amount: 89.3 },
  { day: "Fri", amount: 156.7 },
  { day: "Sat", amount: 234.5 },
  { day: "Sun", amount: 98.4 },
]

const insights = [
  {
    title: "Biggest Spending Day",
    value: "Saturday",
    change: "+45% vs weekdays",
    icon: ArrowUp,
    trend: "up",
  },
  {
    id: 2,
    title: "Most Expensive Category",
    value: "Housing",
    change: "56% of total budget",
    icon: ArrowUp,
    trend: "neutral",
  },
  {
    id: 3,
    title: "Savings This Month",
    value: "$1,305",
    change: "+23% vs last month",
    icon: ArrowUp,
    trend: "up",
  },
  {
    id: 4,
    title: "Avg Daily Spending",
    value: "$71.50",
    change: "-8% vs last month",
    icon: ArrowDown,
    trend: "down",
  },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-20">
      <Navigation />

      <main className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-balance">Analytics & Insights</h1>
          <p className="text-sm text-muted-foreground">Understand your spending patterns</p>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {insights.map((insight) => {
            const Icon = insight.icon
            return (
              <Card key={insight.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold mb-1">{insight.value}</p>
                  <div className="flex items-center gap-1">
                    <Icon
                      className={cn(
                        "h-3 w-3",
                        insight.trend === "up"
                          ? "text-success"
                          : insight.trend === "down"
                            ? "text-destructive"
                            : "text-muted-foreground",
                      )}
                    />
                    <span className="text-xs text-muted-foreground">{insight.change}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts */}
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlySpending}>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-card p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-muted-foreground">{payload[0].payload.month}</span>
                                  <span className="font-bold">${payload[0].value}</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Monthly Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$2,253</p>
                  <div className="flex items-center gap-1 text-sm text-success mt-1">
                    <TrendingDown className="h-4 w-4" />
                    <span>5% lower than average</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Highest Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">April</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <span>$2,567 total spending</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Spending Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklySpending}>
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-card p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-muted-foreground">{payload[0].payload.day}</span>
                                  <span className="font-bold">${payload[0].value}</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Spending Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  Your spending peaks on <span className="font-semibold text-foreground">weekends</span>, especially
                  Saturdays. Consider setting a weekend budget to better control discretionary spending.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-card p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs text-muted-foreground">{payload[0].name}</span>
                                  <span className="font-bold">${payload[0].value}</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {categoryBreakdown.map((category, i) => (
                <Card key={i}>
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    <span className="font-bold">${category.value.toFixed(2)}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
