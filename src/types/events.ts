export interface Event {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface EventBudget {
  id: string;
  event_id: string;
  user_id: string;
  budget_date: string;
  item_name: string;
  amount: number;
  created_at: string;
}

export interface EventPayload {
  name: string;
  start_date: string;
  end_date: string;
}

export interface EventBudgetPayload {
  event_id: string;
  budget_date: string;
  item_name: string;
  amount: number;
}
