import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { budgetSchema } from "@/lib/validation"
import type { Budget, Transaction } from "@/lib/models/user"
import { ObjectId } from "mongodb"

// GET all budgets for current user
export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const budgetsCollection = db.collection<Budget>("budgets")
    const transactionsCollection = db.collection<Transaction>("transactions")

    const budgets = await budgetsCollection.find({ userId: new ObjectId(payload.userId as string) }).toArray()

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const now = new Date()
        let startDate = new Date()

        if (budget.period === "monthly") {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        } else if (budget.period === "weekly") {
          const day = now.getDay()
          startDate = new Date(now)
          startDate.setDate(now.getDate() - day)
        } else if (budget.period === "yearly") {
          startDate = new Date(now.getFullYear(), 0, 1)
        }

        const transactions = await transactionsCollection
          .find({
            userId: new ObjectId(payload.userId as string),
            category: budget.category,
            type: "expense",
            date: { $gte: startDate },
          })
          .toArray()

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0)

        return {
          ...budget,
          spent,
        }
      }),
    )

    return NextResponse.json({ budgets: budgetsWithSpent })
  } catch (error) {
    console.error("[v0] Get budgets error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new budget
export async function POST(request: Request) {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validation = budgetSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { category, limit, period } = validation.data

    const db = await getDatabase()
    const budgetsCollection = db.collection<Budget>("budgets")

    // Check if budget already exists for this category
    const existingBudget = await budgetsCollection.findOne({
      userId: new ObjectId(payload.userId as string),
      category,
    })

    if (existingBudget) {
      return NextResponse.json({ error: "Budget already exists for this category" }, { status: 409 })
    }

    const result = await budgetsCollection.insertOne({
      userId: new ObjectId(payload.userId as string),
      category,
      limit,
      spent: 0,
      period,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const budget = await budgetsCollection.findOne({ _id: result.insertedId })

    return NextResponse.json({ budget }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create budget error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
