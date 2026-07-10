import { TransactionType } from './categories'; // Or just define it here to prevent circular dependencies, it is used in transactions and categories.

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}
