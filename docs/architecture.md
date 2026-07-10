# Project Architecture Documentation

This document describes the architectural layout, modules, and component structure of the **FinManage** application.

## High-Level Architecture Overview

The application follows the **Single Responsibility Principle (SRP)**. Code is split by functional domain and layer.

```
src/
├── api/             # API layer (Raw Supabase interactions)
├── components/      # UI components split by feature domain
│   ├── accounts/    # Form & list elements for accounts
│   ├── dashboard/   # High-level overview card widgets
│   ├── common/      # Reusable components shared by multiple features
│   ├── ui/          # Standard shadcn UI components (Button, Card, Input)
│   └── ...
├── contexts/        # React context wrappers (Authentication state)
├── hooks/           # TanStack (React) Query hooks separated by resource
├── lib/             # Third-party instantiations & shared utility functions
├── pages/           # Page container components (One subfolder per page with its test)
└── types/           # Domain-specific TypeScript declarations
```

---

## Technical Layers

### 1. Data Types (`src/types/`)
Rather than a single monolithic types file, data models are divided into distinct module files representing database tables/concepts:
* `accounts.ts`: Custom financial accounts definitions (Cash, Wallet, Bank).
* `categories.ts`: Income & expense classifications.
* `transactions.ts`: Payload and response types for ledger transactions.
* `assets.ts` & `liabilities.ts`: Current holdings and loan/debt interfaces.
* `funds.ts`: Savings targets.

### 2. API Layer (`src/api/`)
Handles requests to the Supabase database. Each resource resides in its own module:
* Functions like `getAccounts`, `createTransaction`, and `getGroupSummary` call `supabase` directly.
* Exports are unified under `src/api/index.ts` via a central barrel file.

### 3. Hooks Layer (`src/hooks/`)
Uses **TanStack Query (React Query)** to handle caching, background refetching, and cache invalidation.
* Hooks like `useAccounts` map queries, while mutation hooks like `useCreateAccount` automatically trigger cache invalidation:
  ```ts
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
  ```

### 4. Components (`src/components/`)
Divided into three tiers:
1. **`ui/`**: Base atomic components built in **shadcn/ui** style. They use CVA (class-variance-authority) for variant combinations (e.g. outline vs primary buttons) and standard styling tags.
2. **`common/`**: Shared panels or utility layouts.
3. **Feature folders (e.g. `transactions/`)**: Components only utilized within a specific page domain (e.g., `TransactionForm` inside the transactions page).

### 5. Pages (`src/pages/`)
Each page contains a container component and its related Jest test file. The page containers import domain queries and render feature-specific sub-components.
