"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Wallet, CreditCard, PiggyBank, Indent as Investment } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const wealthData = [
  { month: "Jan", value: 10200 },
  { month: "Feb", value: 10850 },
  { month: "Mar", value: 11200 },
  { month: "Apr", value: 11680 },
  { month: "May", value: 11950 },
  { month: "Jun", value: 12458 },
]

const assets = [
  { name: "Main Checking", amount: 3240.5, icon: Wallet, type: "checking", change: 5.2 },
  { name: "Emergency Savings", amount: 8150.82, icon: PiggyBank, type: "savings", change: 2.1 },
  { name: "Robinhood Portfolio", amount: 2100.0, icon: Investment, type: "investment", change: 8.5 },
  { name: "Chase Freedom", amount: -933.0, icon: CreditCard, type: "credit_card", change: -12.3 },
]

export default function WealthPage() {
  const totalAssets = assets.filter((a) => a.type !== "credit_card").reduce((sum, a) => sum + a.amount, 0)
  const totalDebt = assets.filter((a) => a.type === "credit_card").reduce((sum, a) => sum + Math.abs(a.amount), 0)
  const netWorth = totalAssets - totalDebt

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-20">
      <Navigation />

      <main className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-balance">Wealth Overview</h1>
          <p className="text-sm text-muted-foreground">Track your net worth growth</p>
        </div>

        {/* Net Worth Card with Chart */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-2">Total Net Worth</CardTitle>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-4xl font-bold">
                    ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <span className="text-success flex items-center text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +$2,258 (22.1%)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Last 6 months</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={wealthData}>
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
                              <span className="font-bold">${payload[0].value?.toLocaleString()}</span>
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
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Assets Breakdown */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Assets & Liabilities</h3>
        </div>

        <div className="space-y-3 mb-6">
          {assets.map((asset, i) => {
            const Icon = asset.icon
            const isPositive = asset.amount > 0
            return (
              <Card key={i}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.change > 0 ? "+" : ""}
                        {asset.change}% this month
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${isPositive ? "text-foreground" : "text-destructive"}`}>
                      {isPositive ? "" : "-"}$
                      {Math.abs(asset.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">
                ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">
                ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
