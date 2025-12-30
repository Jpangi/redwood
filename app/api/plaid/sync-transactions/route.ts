import { NextResponse } from "next/server"
import { plaidClient } from "@/lib/plaid"
import { getDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Account, Transaction } from "@/lib/models/user"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const payload = await getCurrentUser()
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const accountsCollection = db.collection<Account>("accounts")
    const transactionsCollection = db.collection<Transaction>("transactions")

    // Get account with Plaid access token
    const account = await accountsCollection.findOne({
      _id: new ObjectId(accountId),
      userId: new ObjectId(payload.userId as string),
    })

    if (!account || !account.plaidAccessToken) {
      return NextResponse.json({ error: "Account not found or not linked to bank" }, { status: 404 })
    }

    // Sync transactions from Plaid
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30) // Last 30 days

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: account.plaidAccessToken,
      start_date: startDate.toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
    })

    const plaidTransactions = transactionsResponse.data.transactions.filter(
      (t) => t.account_id === account.plaidAccountId,
    )

    let syncedCount = 0

    for (const plaidTx of plaidTransactions) {
      // Check if transaction already exists
      const existing = await transactionsCollection.findOne({
        userId: new ObjectId(payload.userId as string),
        accountId: new ObjectId(accountId),
        description: plaidTx.name,
        amount: Math.abs(plaidTx.amount),
        date: new Date(plaidTx.date),
      })

      if (!existing) {
        await transactionsCollection.insertOne({
          userId: new ObjectId(payload.userId as string),
          accountId: new ObjectId(accountId),
          type: plaidTx.amount > 0 ? "expense" : "income",
          amount: Math.abs(plaidTx.amount),
          category: plaidTx.category?.[0] || "Other",
          description: plaidTx.name,
          date: new Date(plaidTx.date),
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        syncedCount++
      }
    }

    // Update account balance
    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: account.plaidAccessToken,
    })

    const updatedAccount = balanceResponse.data.accounts.find((a) => a.account_id === account.plaidAccountId)

    if (updatedAccount) {
      await accountsCollection.updateOne(
        { _id: new ObjectId(accountId) },
        {
          $set: {
            balance: updatedAccount.balances.current || 0,
            updatedAt: new Date(),
          },
        },
      )
    }

    return NextResponse.json({
      message: `Synced ${syncedCount} new transactions`,
      syncedCount,
    })
  } catch (error) {
    console.error("[v0] Sync transactions error:", error)
    return NextResponse.json({ error: "Failed to sync transactions" }, { status: 500 })
  }
}
