import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { transactionSchema } from "@/lib/validation"
import type { Transaction, Account } from "@/lib/models/user"
import { ObjectId } from "mongodb"

// GET all transactions for current user
export async function GET(request: Request) {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("accountId")
    const category = searchParams.get("category")

    const db = await getDatabase()
    const transactionsCollection = db.collection<Transaction>("transactions")

    const query: any = { userId: new ObjectId(payload.userId as string) }
    if (accountId) {
      query.accountId = new ObjectId(accountId)
    }
    if (category) {
      query.category = category
    }

    const transactions = await transactionsCollection.find(query).sort({ date: -1 }).limit(100).toArray()

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("[v0] Get transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new transaction
export async function POST(request: Request) {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validation = transactionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { accountId, type, amount, category, description, date } = validation.data

    const db = await getDatabase()
    const accountsCollection = db.collection<Account>("accounts")
    const transactionsCollection = db.collection<Transaction>("transactions")

    // Verify account belongs to user
    const account = await accountsCollection.findOne({
      _id: new ObjectId(accountId),
      userId: new ObjectId(payload.userId as string),
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Create transaction
    const result = await transactionsCollection.insertOne({
      userId: new ObjectId(payload.userId as string),
      accountId: new ObjectId(accountId),
      type,
      amount,
      category,
      description,
      date: new Date(date),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Update account balance
    const balanceChange = type === "income" ? amount : -amount
    const newBalance = account.balance + balanceChange

    await accountsCollection.updateOne(
      { _id: new ObjectId(accountId) },
      { $set: { balance: newBalance, updatedAt: new Date() } },
    )

    const transaction = await transactionsCollection.findOne({ _id: result.insertedId })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
