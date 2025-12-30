"use client"

import { cn } from "@/lib/utils"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Plus, DollarSign } from "lucide-react"

export default function HomePage() {
  const checkingBalance = 3240.5
  const savingsBalance = 8150.82
  const investmentBalance = 2100.0
  const creditCardDebt = 933.0
  const netWorth = checkingBalance + savingsBalance + investmentBalance - creditCardDebt

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0 md:pl-20">
        <Navigation />

        <main className="container max-w-4xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-balance">WealthTrack</h1>
              <p className="text-sm text-muted-foreground">Welcome back</p>
            </div>
            <Button size="icon" className="rounded-full h-12 w-12">
              <Plus className="h-6 w-6" />
            </Button>
          </div>

          {/* Net Worth Card */}
          <Card className="mb-6 border-0 bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <p className="text-sm opacity-90 mb-1">Total Net Worth</p>
              <h2 className="text-4xl font-bold mb-4">
                ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">+$234.12 (1.9%)</span>
                <span className="opacity-75">this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">$3,450</span>
                  <span className="text-sm text-success flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    12%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">$2,145</span>
                  <span className="text-sm text-destructive flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    8%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Grocery Store", amount: -87.45, category: "Food", date: "Today" },
                { name: "Salary Deposit", amount: 3450.0, category: "Income", date: "Yesterday" },
                { name: "Coffee Shop", amount: -5.75, category: "Food", date: "Yesterday" },
                { name: "Gas Station", amount: -52.3, category: "Transport", date: "2 days ago" },
              ].map((transaction, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <span className={cn("font-semibold", transaction.amount > 0 ? "text-success" : "text-foreground")}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
