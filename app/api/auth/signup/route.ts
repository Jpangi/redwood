import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"
import { signupSchema } from "@/lib/validation"
import type { User } from "@/lib/models/user"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { email, password, firstName, lastName } = validation.data

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const result = await usersCollection.insertOne({
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create JWT token
    const token = await createToken(result.insertedId.toString())

    // Set secure HTTP-only cookie
    await setAuthCookie(token)

    return NextResponse.json(
      {
        user: {
          id: result.insertedId,
          email,
          firstName,
          lastName,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
