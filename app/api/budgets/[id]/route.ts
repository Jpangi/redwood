import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { budgetSchema } from "@/lib/validation"
import type { Budget } from "@/lib/models/user"
import { ObjectId } from "mongodb"

// PUT update budget
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const result = await budgetsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(payload.userId as string),
      },
      {
        $set: {
          category,
          limit,
          period,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json({ budget: result })
  } catch (error) {
    console.error("[v0] Update budget error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE budget
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const budgetsCollection = db.collection<Budget>("budgets")

    const result = await budgetsCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(payload.userId as string),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Budget deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete budget error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
