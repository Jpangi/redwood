import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@/lib/models/user"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    const user = await usersCollection.findOne(
      { _id: new ObjectId(payload.userId as string) },
      { projection: { passwordHash: 0 } },
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (error) {
    console.error("[v0] Get current user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
