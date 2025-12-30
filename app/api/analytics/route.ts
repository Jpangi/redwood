import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Transaction, Account } from "@/lib/models/user"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const transactionsCollection = db.collection<Transaction>("transactions")
    const accountsCollection = db.collection<Account>("accounts")

    const userId = new ObjectId(payload.userId as string)

    // Get all transactions
    const transactions = await transactionsCollection.find({ userId }).sort({ date: -1 }).toArray()

    // Get all accounts
    const accounts = await accountsCollection.find({ userId }).toArray()

    // Calculate net worth (assets - credit card debt)
    const netWorth = accounts.reduce((total, account) => {
      if (account.type === "credit_card") {
        return total - account.balance // Credit card balance is debt
      }
      return total + account.balance
    }, 0)

    // Calculate total income
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    // Calculate total expenses
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    // Category breakdown
    const categoryBreakdown = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = 0
          }
          acc[t.category] += t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyData = transactions
      .filter((t) => t.date >= sixMonthsAgo)
      .reduce(
        (acc, t) => {
          const monthKey = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}`
          if (!acc[monthKey]) {
            acc[monthKey] = { income: 0, expenses: 0 }
          }
          if (t.type === "income") {
            acc[monthKey].income += t.amount
          } else {
            acc[monthKey].expenses += t.amount
          }
          return acc
        },
        {} as Record<string, { income: number; expenses: number }>,
      )

    return NextResponse.json({
      netWorth,
      totalIncome,
      totalExpenses,
      categoryBreakdown,
      monthlyTrends: monthlyData,
      accounts: accounts.map((a) => ({
        id: a._id,
        name: a.name,
        type: a.type,
        balance: a.balance,
      })),
    })
  } catch (error) {
    console.error("[v0] Get analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
