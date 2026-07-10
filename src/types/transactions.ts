import { TransactionType } from './categories';

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
