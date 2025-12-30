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

## Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB database (local or cloud like MongoDB Atlas)
- npm or yarn package manager

### Setup Instructions

1. **Download the project**
   ```bash
   # Download the ZIP from v0 or use the shadcn CLI
   npx shadcn@latest add v0 --project-id=YOUR_PROJECT_ID
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/wealth-tracker
   # or use MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wealth-tracker
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Plaid (Optional - for bank linking)
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   PLAID_ENV=sandbox
   
   # Stripe (Coming soon)
   # STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT token generation |
| `PLAID_CLIENT_ID` | No | Plaid client ID for bank linking |
| `PLAID_SECRET` | No | Plaid secret key |
| `PLAID_ENV` | No | Plaid environment (sandbox/development/production) |

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Accounts
- `GET /api/accounts` - Get all user accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/[id]` - Update account
- `DELETE /api/accounts/[id]` - Delete account

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all user budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

### Analytics
- `GET /api/analytics` - Get financial analytics and insights

### Plaid Integration
- `POST /api/plaid/create-link-token` - Create Plaid Link token
- `POST /api/plaid/exchange-token` - Exchange public token for access token
- `POST /api/plaid/sync-transactions` - Sync transactions from linked bank

## Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: HTTP-only cookies to prevent XSS attacks
- **Input Validation**: Zod schemas validate all user inputs
- **SQL Injection Protection**: MongoDB parameterized queries
- **CORS Protection**: Configured middleware for API security
- **Authentication Middleware**: All protected routes require valid JWT

## Project Structure

```
wealth-tracker/
├── app/
│   ├── accounts/          # Account management page
│   ├── analytics/         # Analytics dashboard
│   ├── api/              # Backend API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── accounts/     # Account CRUD
│   │   ├── transactions/ # Transaction CRUD
│   │   ├── budgets/      # Budget CRUD
│   │   └── plaid/        # Bank linking
│   ├── budgets/          # Budget goals page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── transactions/     # Transaction history
│   ├── wealth/           # Net worth dashboard
│   ├── layout.tsx        # Root layout with auth provider
│   └── page.tsx          # Home dashboard
├── components/
│   ├── navigation.tsx    # App navigation
│   ├── protected-route.tsx # Auth protection wrapper
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── auth.ts           # Auth utilities (JWT, bcrypt)
│   ├── auth-context.tsx  # Auth state management
│   ├── db.ts             # MongoDB connection
│   ├── plaid.ts          # Plaid client setup
│   ├── validation.ts     # Zod schemas
│   └── models/           # MongoDB models
│       └── user.ts
└── .env.local.example    # Example environment variables
```

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
