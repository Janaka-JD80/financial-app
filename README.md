# FinManage

A comprehensive financial management application built with React, Vite, Tailwind CSS, TypeScript, and Supabase. FinManage helps you track your expenses, income, assets, liabilities, and savings funds.

## Features

- **Dashboard**: High-level overview of your monthly net income, asset vs liability ratio, and recent transaction history.
- **Transactions**: Track and categorize all your income and expenses. Filter transactions by date range, category, or group.
- **Accounts**: Manage multiple financial accounts (e.g., cash, bank accounts, credit cards) and keep their balances updated.
- **Assets & Liabilities**: Keep record of physical/digital assets and track debts and loans (liabilities).
- **Reports**: Analyze your spending patterns with interactive visual charts (aggregated daily, monthly, or annually).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd financial-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build the application for production:
   ```bash
   npm run build
   ```
