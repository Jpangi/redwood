import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { accountSchema } from "@/lib/validation"
import type { Account } from "@/lib/models/user"
import { ObjectId } from "mongodb"

// GET single account
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const accountsCollection = db.collection<Account>("accounts")

    const account = await accountsCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(payload.userId as string),
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({ account })
  } catch (error) {
    console.error("[v0] Get account error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update account
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const result = await accountsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(payload.userId as string),
      },
      {
        $set: {
          name,
          type,
          balance,
          institution,
          lastFour,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({ account: result })
  } catch (error) {
    console.error("[v0] Update account error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE account
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const accountsCollection = db.collection<Account>("accounts")

    const result = await accountsCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(payload.userId as string),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete account error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
