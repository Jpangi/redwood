# Wealth Tracking App

A modern budgeting and wealth tracking application designed for young people to manage their finances, understand spending habits, and grow their money. Features a clean blue/white/black UI inspired by Robinhood with comprehensive financial management tools.

## Features

- **Account Management**: Connect and manage multiple bank accounts (Checking, Savings, Investment, Credit Cards)
- **Transaction Tracking**: Automatically categorize expenses and track spending across all accounts
- **Net Worth Dashboard**: Real-time calculation of total wealth (assets minus credit card debt)
- **Budget Goals**: Set monthly budgets by category with visual progress tracking
- **Analytics & Insights**: Comprehensive spending trends, category breakdowns, and financial insights
- **Bank Account Linking**: Integration with Plaid for automatic transaction syncing
- **Secure Authentication**: JWT-based auth with bcrypt password hashing

## Tech Stack

### Frontend
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS v4
- Recharts for data visualization
- shadcn/ui components

### Backend
- Next.js API Routes (Express-style routing)
- MongoDB with Mongoose ODM
- JWT authentication with HTTP-only cookies
- bcrypt for password hashing
- Zod for input validation

### Integrations
- Plaid API for bank account linking
- Stripe (coming soon for payments)


## Usage

1. **Sign Up**: Create an account on the signup page
2. **Add Accounts**: Navigate to Accounts and add your bank accounts (or link via Plaid)
3. **Track Transactions**: Add transactions manually or sync automatically from linked banks
4. **Set Budgets**: Create monthly budgets for different spending categories
5. **Monitor Wealth**: View your net worth dashboard and track growth over time
6. **Analyze Spending**: Check analytics for insights into spending patterns

## Net Worth Calculation

The app calculates net worth as:
```
Net Worth = (Checking + Savings + Investments) - Credit Card Debt
```

Credit card balances are treated as negative values (debt) and subtracted from total assets.

## Future Enhancements

- Stripe integration for one-time payments/subscriptions
- Bill reminders and recurring transaction tracking
- Investment portfolio tracking with real-time stock prices
- Savings goals with progress visualization
- Mobile app (React Native)
- CSV export for transactions and reports

## Troubleshooting

**MongoDB Connection Issues**
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check that your IP address is whitelisted in MongoDB Atlas

**Plaid Integration Not Working**
- Verify Plaid credentials are correct in `.env.local`
- Ensure you're using the correct environment (sandbox for testing)

**Authentication Errors**
- Clear browser cookies and try logging in again
- Ensure JWT_SECRET is set in `.env.local`

## Contributing

This project was built with v0 by Vercel. To modify:
1. Make changes in VS Code
2. Test locally with `npm run dev`
3. Deploy to Vercel with `vercel deploy`

## License

MIT License - feel free to use this project for personal or commercial purposes.
