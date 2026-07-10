# Supabase Integration Documentation

This document explains how **Supabase** works as the backend database and authentication system for **FinManage**.

## Supabase Client Configuration

The connection is initialized in [supabase.ts](file:///d:/My/financial-app/src/lib/supabase.ts):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```
At runtime, Vite reads the credentials from `.env` and exports the configured client (`supabase`) to be used in all API modules.

---

## Authentication System

Supabase Auth manages user credentials and sessions. 
- In [auth.ts](file:///d:/My/financial-app/src/api/auth.ts), the application leverages standard helpers:
  - `signUpUser(email, password)`: Registers a new user account with `supabase.auth.signUp()`.
  - `signInUser(email, password)`: Authenticates an existing user and creates a session with `supabase.auth.signInWithPassword()`.
  - `signOutUser()`: Destroys the active session token using `supabase.auth.signOut()`.
- **Session Context**: The React state context [AuthContext.tsx](file:///d:/My/financial-app/src/contexts/AuthContext.tsx) listens to session changes automatically:
  ```typescript
  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
  });
  ```
  This is utilized to secure page routes: if a user lacks a session, they are redirected to `/login`.

---

## Database Schema & Tables

The API layer queries the PostgreSQL tables provided by Supabase using JSON-like selectors:

### 1. Accounts (`accounts` table)
Stores cash holdings or bank entities:
- Schema: `id (uuid)`, `name (text)`, `type (text)`, `balance (numeric)`.
- Query syntax: `supabase.from('accounts').select('*')`.

### 2. Transactions & Categories (`transactions`, `categories` tables)
Records individual ledger items:
- Schema: `id`, `amount`, `type (income/expense)`, `transaction_date`, `account_id`, `category_id`, `group_id`.
- The transaction listing queries details using PostgreSQL foreign-key relationship joins:
  ```typescript
  const { data } = await supabase
    .from('transactions')
    .select(`
      *,
      accounts(name),
      categories(name),
      transaction_groups(name)
    `)
  ```
  Supabase automatically formats the related record as nested JSON objects (e.g. `tx.categories.name`).
