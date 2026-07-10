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
