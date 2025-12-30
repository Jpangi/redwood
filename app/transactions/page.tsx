"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Utensils,
  DollarSign,
  Wallet,
  PiggyBank,
  TrendingUp,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { value: "food", label: "Food & Dining", icon: Utensils },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "transport", label: "Transport", icon: Car },
  { value: "housing", label: "Housing", icon: Home },
  { value: "entertainment", label: "Entertainment", icon: Coffee },
  { value: "income", label: "Income", icon: DollarSign },
]

const mockAccounts = [
  { id: 1, name: "Main Checking", icon: Wallet },
  { id: 2, name: "Emergency Savings", icon: PiggyBank },
  { id: 3, name: "Robinhood Portfolio", icon: TrendingUp },
  { id: 4, name: "Chase Freedom", icon: CreditCard },
]

const mockTransactions = [
  {
    id: 1,
    name: "Whole Foods Market",
    amount: -87.45,
    category: "food",
    accountId: 1,
    date: "2024-01-15",
    time: "14:30",
  },
  {
    id: 2,
    name: "Monthly Salary",
    amount: 3450.0,
    category: "income",
    accountId: 1,
    date: "2024-01-15",
    time: "09:00",
  },
  { id: 3, name: "Starbucks", amount: -5.75, category: "food", accountId: 4, date: "2024-01-14", time: "08:15" },
  {
    id: 4,
    name: "Shell Gas Station",
    amount: -52.3,
    category: "transport",
    accountId: 4,
    date: "2024-01-13",
    time: "17:45",
  },
  { id: 5, name: "Amazon", amount: -124.99, category: "shopping", accountId: 4, date: "2024-01-12", time: "20:30" },
  {
    id: 6,
    name: "Rent Payment",
    amount: -1200.0,
    category: "housing",
    accountId: 1,
    date: "2024-01-01",
    time: "00:00",
  },
  { id: 7, name: "Target", amount: -45.67, category: "shopping", accountId: 1, date: "2024-01-11", time: "16:20" },
  {
    id: 8,
    name: "Netflix",
    amount: -15.99,
    category: "entertainment",
    accountId: 4,
    date: "2024-01-10",
    time: "12:00",
  },
]

export default function TransactionsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = mockTransactions.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getCategoryIcon = (categoryValue: string) => {
    const category = categories.find((c) => c.value === categoryValue)
    return category ? category.icon : DollarSign
  }

  const getAccount = (accountId: number) => {
    return mockAccounts.find((a) => a.id === accountId) || { name: "Unknown", icon: Wallet }
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-20">
      <Navigation />

      <main className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-balance">Transactions</h1>
            <p className="text-sm text-muted-foreground">View and manage your transactions</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-12 w-12">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>Record a new income or expense transaction</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Description</Label>
                  <Input id="name" placeholder="e.g., Grocery shopping" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account</Label>
                  <Select>
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <Button type="submit" className="w-full">
                  Add Transaction
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => {
            const Icon = getCategoryIcon(transaction.category)
            const account = getAccount(transaction.accountId)
            const AccountIcon = account.icon
            return (
              <Card key={transaction.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <AccountIcon className="h-3 w-3" />
                        {account.name} •{" "}
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn("font-semibold text-lg", transaction.amount > 0 ? "text-success" : "text-foreground")}
                  >
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
