import { NextResponse } from "next/server"
import { plaidClient } from "@/lib/plaid"
import { getCurrentUser } from "@/lib/auth"
import { CountryCode, Products } from "plaid"

export async function POST() {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const request = {
      user: {
        client_user_id: payload.userId as string,
      },
      client_name: "Wealth Tracker",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    }

    const response = await plaidClient.linkTokenCreate(request)

    return NextResponse.json({ linkToken: response.data.link_token })
  } catch (error) {
    console.error("[v0] Create link token error:", error)
    return NextResponse.json({ error: "Failed to create link token" }, { status: 500 })
  }
}
