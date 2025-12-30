"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Utensils, ShoppingBag, Car, Coffee, Zap, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const budgets = [
  {
    id: 1,
    category: "Food & Dining",
    icon: Utensils,
    budget: 500,
    spent: 387.45,
    color: "hsl(var(--chart-1))",
  },
  {
    id: 2,
    category: "Shopping",
    icon: ShoppingBag,
    budget: 300,
    spent: 245.67,
    color: "hsl(var(--chart-2))",
  },
  {
    id: 3,
    category: "Transport",
    icon: Car,
    budget: 200,
    spent: 152.3,
    color: "hsl(var(--chart-3))",
  },
  {
    id: 4,
    category: "Entertainment",
    icon: Coffee,
    budget: 150,
    spent: 98.75,
    color: "hsl(var(--chart-4))",
  },
  {
    id: 5,
    category: "Utilities",
    icon: Zap,
    budget: 250,
    spent: 245.0,
    color: "hsl(var(--chart-5))",
  },
]

export default function BudgetsPage() {
  const [isOpen, setIsOpen] = useState(false)

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const overallPercentage = (totalSpent / totalBudget) * 100

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-20">
      <Navigation />

      <main className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-balance">Budget Goals</h1>
            <p className="text-sm text-muted-foreground">Track spending against your limits</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-12 w-12">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget</DialogTitle>
                <DialogDescription>Set a spending limit for a category</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Monthly Budget</Label>
                  <Input id="amount" type="number" step="0.01" placeholder="0.00" />
                </div>
                <Button type="submit" className="w-full">
                  Create Budget
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overall Budget Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">of ${totalBudget.toFixed(2)} budget</p>
              </div>
              <div className="text-right">
                <p className={cn("text-2xl font-bold", overallPercentage > 90 ? "text-destructive" : "text-success")}>
                  {overallPercentage.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">used</p>
              </div>
            </div>
            <Progress value={overallPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">${(totalBudget - totalSpent).toFixed(2)} remaining</p>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <div className="space-y-4">
          {budgets.map((budget) => {
            const Icon = budget.icon
            const percentage = (budget.spent / budget.budget) * 100
            const isNearLimit = percentage > 80
            const isOverBudget = percentage > 100

            return (
              <Card key={budget.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: budget.color, opacity: 0.15 }}
                      >
                        <Icon className="h-6 w-6" style={{ color: budget.color }} />
                      </div>
                      <div>
                        <p className="font-medium">{budget.category}</p>
                        <p className="text-sm text-muted-foreground">
                          ${budget.spent.toFixed(2)} of ${budget.budget.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-xl font-bold",
                          isOverBudget ? "text-destructive" : isNearLimit ? "text-warning" : "text-success",
                        )}
                      >
                        {percentage.toFixed(0)}%
                      </p>
                      {isNearLimit && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <AlertCircle className="h-3 w-3" />
                          <span>{isOverBudget ? "Over" : "Near"} limit</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-2"
                    style={
                      {
                        "--progress-background": budget.color,
                      } as React.CSSProperties
                    }
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${(budget.budget - budget.spent).toFixed(2)} left</span>
                    <span>{Math.max(0, 100 - percentage).toFixed(0)}% available</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
