import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  _id?: ObjectId
  userId: ObjectId
  name: string
  type: "checking" | "savings" | "investment" | "credit_card"
  balance: number
  institution?: string
  lastFour?: string
  plaidAccessToken?: string
  plaidAccountId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  _id?: ObjectId
  userId: ObjectId
  accountId: ObjectId
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  _id?: ObjectId
  userId: ObjectId
  category: string
  limit: number
  spent: number
  period: "monthly" | "weekly" | "yearly"
  createdAt: Date
  updatedAt: Date
}
