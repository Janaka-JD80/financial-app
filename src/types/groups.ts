export interface TransactionGroup {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface GroupSummary {
  totalIncome: number;
  totalExpense: number;
  net: number;
}
