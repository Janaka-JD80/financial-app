export type AccountType = 'cash' | 'bank' | 'wallet';
export type TransactionType = 'income' | 'expense';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface TransactionGroup {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  group_id?: string;
  type: TransactionType;
  amount: number;
  transaction_date: string;
  description?: string;
  is_recurring: boolean;
  recurrence_interval?: string;
  accounts?: { name: string };
  categories?: { name: string };
  transaction_groups?: { name: string };
}

export interface TransactionPayload {
  account_id: string;
  category_id: string;
  group_id?: string | null;
  type: TransactionType;
  amount: number;
  transaction_date: string;
  description?: string;
  is_recurring?: boolean;
  recurrence_interval?: string;
}

export interface Asset {
  id: string;
  name: string;
  purchase_value: number;
  monthly_decay: number;
  purchase_date: string;
  created_at: string;
}

export interface Liability {
  id: string;
  name: string;
  total_amount: number;
  remaining_amount: number;
  start_date: string;
  end_date: string;
}

export interface Fund {
  id: string;
  name: string;
  target_amount?: number;
  current_balance: number;
  auto_add_monthly: number;
}

export interface FundTransfer {
  id: string;
  fund_id: string;
  account_id: string;
  amount: number;
  transfer_date: string;
}

export interface GroupSummary {
  totalIncome: number;
  totalExpense: number;
  net: number;
}
