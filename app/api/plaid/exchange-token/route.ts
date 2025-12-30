import { NextResponse } from "next/server"
import { plaidClient } from "@/lib/plaid"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Account } from "@/lib/models/user"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { publicToken } = await request.json()

    if (!publicToken) {
      return NextResponse.json({ error: "Public token is required" }, { status: 400 })
    }

    // Exchange public token for access token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })

    const accessToken = tokenResponse.data.access_token

    // Get account information
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    })

    const accounts = accountsResponse.data.accounts

    // Get institution information
    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,
    })

    const institutionId = itemResponse.data.item.institution_id

    let institutionName = "Unknown"
    if (institutionId) {
      const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: ["US"] as any,
      })
      institutionName = institutionResponse.data.institution.name
    }

    // Save accounts to database
    const db = await getDatabase()
    const accountsCollection = db.collection<Account>("accounts")

    const createdAccounts = []

    for (const account of accounts) {
      let accountType: "checking" | "savings" | "investment" | "credit_card" = "checking"

      if (account.type === "depository") {
        if (account.subtype === "savings") {
          accountType = "savings"
        } else {
          accountType = "checking"
        }
      } else if (account.type === "credit") {
        accountType = "credit_card"
      } else if (account.type === "investment") {
        accountType = "investment"
      }

      const result = await accountsCollection.insertOne({
        userId: new ObjectId(payload.userId as string),
        name: account.name,
        type: accountType,
        balance: account.balances.current || 0,
        institution: institutionName,
        lastFour: account.mask || undefined,
        plaidAccessToken: accessToken,
        plaidAccountId: account.account_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const createdAccount = await accountsCollection.findOne({ _id: result.insertedId })
      if (createdAccount) {
        createdAccounts.push(createdAccount)
      }
    }

    return NextResponse.json({ accounts: createdAccounts }, { status: 201 })
  } catch (error) {
    console.error("[v0] Exchange token error:", error)
    return NextResponse.json({ error: "Failed to link bank account" }, { status: 500 })
  }
}
