import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { accountSchema } from "@/lib/validation"
import type { Account } from "@/lib/models/user"
import { ObjectId } from "mongodb"

// GET all accounts for current user
export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const accountsCollection = db.collection<Account>("accounts")

    const accounts = await accountsCollection.find({ userId: new ObjectId(payload.userId as string) }).toArray()

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error("[v0] Get accounts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new account
export async function POST(request: Request) {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validation = accountSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { name, type, balance, institution, lastFour } = validation.data

    const db = await getDatabase()
    const accountsCollection = db.collection<Account>("accounts")

    const result = await accountsCollection.insertOne({
      userId: new ObjectId(payload.userId as string),
      name,
      type,
      balance,
      institution,
      lastFour,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const account = await accountsCollection.findOne({ _id: result.insertedId })

    return NextResponse.json({ account }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create account error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
