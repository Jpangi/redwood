import { Configuration, PlaidApi, PlaidEnvironments } from "plaid"

if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
  console.warn("Plaid credentials not found. Bank linking will not be available.")
}

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
      "PLAID-SECRET": process.env.PLAID_SECRET || "",
    },
  },
})

export const plaidClient = new PlaidApi(configuration)
