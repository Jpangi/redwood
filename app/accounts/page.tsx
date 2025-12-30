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
import { Plus, Wallet, TrendingUp, CreditCard, PiggyBank, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AccountType = "checking" | "savings" | "investment" | "credit_card"

interface Account {
  id: number
  name: string
  type: AccountType
  balance: number
  institution: string
}

const accountTypes = [
  { value: "checking", label: "Checking Account", icon: Wallet },
  { value: "savings", label: "Savings Account", icon: PiggyBank },
  { value: "investment", label: "Investment Account", icon: TrendingUp },
  { value: "credit_card", label: "Credit Card", icon: CreditCard },
]

const mockAccounts: Account[] = [
  { id: 1, name: "Main Checking", type: "checking", balance: 3240.5, institution: "Chase Bank" },
  { id: 2, name: "Emergency Savings", type: "savings", balance: 8150.82, institution: "Ally Bank" },
  { id: 3, name: "Robinhood Portfolio", type: "investment", balance: 2100.0, institution: "Robinhood" },
  { id: 4, name: "Chase Freedom", type: "credit_card", balance: 933.0, institution: "Chase Bank" },
]

export default function AccountsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [accounts] = useState<Account[]>(mockAccounts)

  const totalAssets = accounts.filter((a) => a.type !== "credit_card").reduce((sum, a) => sum + a.balance, 0)

  const totalDebt = accounts.filter((a) => a.type === "credit_card").reduce((sum, a) => sum + a.balance, 0)

  const netWorth = totalAssets - totalDebt

  const getAccountIcon = (type: AccountType) => {
    const accountType = accountTypes.find((t) => t.value === type)
    return accountType ? accountType.icon : Building2
  }

  const getAccountColor = (type: AccountType) => {
    switch (type) {
      case "checking":
        return "text-blue-500"
      case "savings":
        return "text-green-500"
      case "investment":
        return "text-purple-500"
      case "credit_card":
        return "text-orange-500"
      default:
        return "text-primary"
    }
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-20">
      <Navigation />

      <main className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-balance">Accounts</h1>
            <p className="text-sm text-muted-foreground">Manage your financial accounts</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-12 w-12">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Account</DialogTitle>
                <DialogDescription>Connect a new financial account to track</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input id="account-name" placeholder="e.g., Main Checking" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-type">Account Type</Label>
                  <Select>
                    <SelectTrigger id="account-type">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input id="institution" placeholder="e.g., Chase Bank" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input id="balance" type="number" step="0.01" placeholder="0.00" />
                </div>
                <Button type="submit" className="w-full">
                  Add Account
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Net Worth Summary */}
        <Card className="mb-6 border-0 bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90 mb-1">Total Net Worth</p>
            <h2 className="text-4xl font-bold mb-4">
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="opacity-75 mb-1">Assets</p>
                <p className="font-semibold">
                  ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Debt</p>
                <p className="font-semibold">
                  ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Type Groups */}
        <div className="space-y-6">
          {/* Asset Accounts */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Assets
            </h3>
            <div className="space-y-3">
              {accounts
                .filter((a) => a.type !== "credit_card")
                .map((account) => {
                  const Icon = getAccountIcon(account.type)
                  return (
                    <Card key={account.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                            <Icon className={cn("h-6 w-6", getAccountColor(account.type))} />
                          </div>
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">{account.institution}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            $
                            {account.balance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{account.type.replace("_", " ")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>

          {/* Liabilities */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-destructive" />
              Liabilities
            </h3>
            <div className="space-y-3">
              {accounts
                .filter((a) => a.type === "credit_card")
                .map((account) => {
                  const Icon = getAccountIcon(account.type)
                  return (
                    <Card key={account.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                            <Icon className={cn("h-6 w-6", getAccountColor(account.type))} />
                          </div>
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">{account.institution}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-destructive">
                            -$
                            {account.balance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">Credit Card</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
