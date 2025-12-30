import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Transaction } from "@/lib/models/user"
import { ObjectId } from "mongodb"

// DELETE transaction
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const transactionsCollection = db.collection<Transaction>("transactions")

    const result = await transactionsCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(payload.userId as string),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
