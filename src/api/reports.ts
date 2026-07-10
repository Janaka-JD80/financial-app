import { supabase } from '../lib/supabase';
import { GroupSummary, Transaction } from '../types';
import { startOfWeek, format as formatDate } from 'date-fns';
import { isTransferTransaction } from '../lib/utils';

export const getGroupSummary = async (groupId: string): Promise<GroupSummary> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type, description, categories(name), transaction_groups(name)')
    .eq('group_id', groupId);
    
  if (error) throw error;

  const typedData = data as unknown as Transaction[];
  const summary = typedData.reduce((acc, curr) => {
    // Skip transfers for group income/expense summaries
    if (isTransferTransaction(curr)) return acc;
    
    if (curr.type === 'income') acc.totalIncome += Number(curr.amount);
    if (curr.type === 'expense') acc.totalExpense += Number(curr.amount);
    return acc;
  }, { totalIncome: 0, totalExpense: 0 });

  return {
    ...summary,
    net: summary.totalIncome - summary.totalExpense
  };
};

export interface ReportFilters {
  startDate: string; // e.g., '2026-03-01'
  endDate: string;   // e.g., '2026-03-31'
  groupId?: string;
  categoryId?: string;
}

export const getTransactionReport = async (filters: ReportFilters): Promise<Transaction[]> => {
  let query = supabase
    .from('transactions')
    .select(`
      id,
      amount,
      type,
      transaction_date,
      description,
      categories(id, name),
      transaction_groups(id, name),
      accounts(id, name)
    `)
    .gte('transaction_date', filters.startDate)
    .lte('transaction_date', filters.endDate)
    .order('transaction_date', { ascending: true });

  // Apply optional filters dynamically
  if (filters.groupId) {
    query = query.eq('group_id', filters.groupId);
  }
  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data as unknown as Transaction[];
};

// Utility to group data by time periods
export const aggregateReportData = (transactions: any[], timeframe: 'daily' | 'weekly' | 'monthly' | 'annually') => {
  const aggregated = transactions.reduce((acc, current) => {
    // Exclude transfers from the main charts and metrics
    if (isTransferTransaction(current)) {
      return acc;
    }

    let key = '';
    const date = new Date(current.transaction_date);

    // Determine the grouping key based on the requested timeframe
    if (timeframe === 'daily') {
      key = current.transaction_date; // 'YYYY-MM-DD'
    } else if (timeframe === 'weekly') {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      key = `Week of ${formatDate(start, 'MMM dd, yyyy')}`;
    } else if (timeframe === 'monthly') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // 'YYYY-MM'
    } else if (timeframe === 'annually') {
      key = `${date.getFullYear()}`; // 'YYYY'
    }

    // Initialize the bucket if it doesn't exist
    if (!acc[key]) {
      acc[key] = { income: 0, expense: 0, date: key };
    }

    // Add amounts to the correct bucket
    if (current.type === 'income') {
      acc[key].income += Number(current.amount);
    } else if (current.type === 'expense') {
      acc[key].expense += Number(current.amount);
    }

    return acc;
  }, {} as Record<string, { income: number; expense: number; date: string }>);

  // Convert the object back into an array for easy mapping in your UI
  return Object.values(aggregated);
};

