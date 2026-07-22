# Functional Requirements

This document outlines the core functional requirements and business logic of the FinManage application.

## 1. App Architecture
- **Tech Stack:** React (Vite), TypeScript, Tailwind CSS.
- **State Management & Data Fetching:** React Query (`@tanstack/react-query`) is used for fetching, caching, and updating server state.
- **Backend/Database:** Supabase provides authentication and the PostgreSQL database.
- **Routing:** React Router is used for client-side routing. Protected routes ensure that only authenticated users can access the dashboard and features.

## 2. Transactions Management
Transactions are the core data model of the app. They record the movement of money.
- **Income & Expense:** Users can create standard income (money in) and expense (money out) transactions.
- **Transfers:** Transfers are represented as paired transactions: one expense (from the source account) and one income (to the destination account). These are linked together using a specific prefix in the `description` field (`[Transfer: <uuid>]`).
- **Categories:** Every standard transaction is linked to a Category (e.g., "Food", "Salary").
- **Accounts:** Transactions are tied to specific Accounts (e.g., "Bank", "Wallet"). A transaction updates the perceived balance of the account it belongs to.

## 3. Events & Budgeting
Events allow users to set aside budgets for specific occasions (e.g., "Summer Vacation", "Wedding").
- **Creating Events:** Users can create events with a `name`, `start_date`, and `end_date`.
- **Budgets:** Each event can have an associated budget.
- **Linking Transactions:** Transactions can be optionally linked to an Event using the `event_id` field. This helps in tracking how much of the event's budget has been spent.

## 4. Loans Management
The Loans feature helps users track money they have lent out and the paybacks they receive.
- **Issuing a Loan:** A loan is simply an expense transaction assigned to the category "Loan".
- **Recording Paybacks:** Paybacks are income transactions assigned to the category "Payback".
- **Linking Paybacks to Loans:** A payback is linked to its original loan by embedding a tag in the description (`[LoanPayback: <loan_id>]`).
- **Legacy Paybacks:** The app seamlessly supports past/legacy paybacks (unlinked or from before the app was created). The Loans dashboard aggregates all "Loan" expenses and all "Payback" incomes to display an accurate Net Outstanding balance, regardless of explicit linking.
- **Mark as Paid UI:** Users can mark a loan as paid by either automatically creating a new payback transaction or selecting an existing unlinked payback transaction. The UI intelligently parses and hides the `[LoanPayback: <id>]` metadata tag from the end-user.

## 5. Accounts & Assets
- **Accounts:** Represents liquid money sources (e.g., Checking Account, Cash).
- **Assets & Liabilities:** Users can manually track their static assets (e.g., Real Estate, Vehicles) and liabilities (e.g., Mortgage, Student Debt). These contribute to the overall Net Worth calculation displayed on the Dashboard.
