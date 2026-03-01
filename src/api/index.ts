import { supabase } from '../lib/supabase';
import {
  Account,
  Category,
  TransactionGroup,
  Transaction,
  TransactionPayload,
  Asset,
  Liability,
  Fund,
  FundTransfer,
  GroupSummary,
} from '../types';

// --- ACCOUNTS ---
export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase.from('accounts').select('*');
  if (error) throw error;
  return data;
};

export const createAccount = async (name: string, type: string, balance: number = 0): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .insert([{ name, type, balance }])
    .select();
  if (error) throw error;
  return data;
};

export const updateAccount = async (id: string, updates: { name?: string, type?: string }) => {
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteAccount = async (id: string) => {
  // Note: This will fail if there are transactions linked to this account. 
  // You must delete or reassign the transactions first.
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- CATEGORIES ---
export const getCategories = async (type?: 'income' | 'expense'): Promise<Category[]> => {
  let query = supabase.from('categories').select('*');
  if (type) query = query.eq('type', type);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createCategory = async (name: string, type: 'income' | 'expense'): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, type }])
    .select();
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, name: string) => {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- TRANSACTION GROUPS ---
export const getActiveGroups = async (): Promise<TransactionGroup[]> => {
  const { data, error } = await supabase
    .from('transaction_groups')
    .select('*')
    .eq('is_active', true);
  if (error) throw error;
  return data;
};

export const createGroup = async (name: string, description?: string): Promise<TransactionGroup[]> => {
  const { data, error } = await supabase
    .from('transaction_groups')
    .insert([{ name, description }])
    .select();
  if (error) throw error;
  return data;
};

export const updateGroup = async (id: string, updates: { name?: string, description?: string, is_active?: boolean }) => {
  const { data, error } = await supabase
    .from('transaction_groups')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteGroup = async (id: string) => {
  const { error } = await supabase
    .from('transaction_groups')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- TRANSACTIONS ---
export const createTransaction = async (payload: TransactionPayload): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([payload])
    .select();
  if (error) throw error;
  return data;
};

export const getTransactions = async (startDate?: string, endDate?: string): Promise<Transaction[]> => {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      accounts(name),
      categories(name),
      transaction_groups(name)
    `)
    .order('transaction_date', { ascending: false });

  if (startDate) query = query.gte('transaction_date', startDate);
  if (endDate) query = query.lte('transaction_date', endDate);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateTransaction = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteTransaction = async (id: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- ASSETS ---
export const getAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase.from('assets').select('*');
  if (error) throw error;
  return data;
};

export const createAsset = async (name: string, purchase_value: number, monthly_decay: number, purchase_date: string): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('assets')
    .insert([{ name, purchase_value, monthly_decay, purchase_date }])
    .select();
  if (error) throw error;
  return data;
};

export const updateAsset = async (id: string, updates: { name?: string, monthly_decay?: number }) => {
  const { data, error } = await supabase.from('assets').update(updates).eq('id', id).select();
  if (error) throw error;
  return data;
};

// --- LIABILITIES ---
export const getLiabilities = async (): Promise<Liability[]> => {
  const { data, error } = await supabase.from('liabilities').select('*');
  if (error) throw error;
  return data;
};

export const createLiability = async (name: string, total_amount: number, start_date: string, end_date: string): Promise<Liability[]> => {
  const { data, error } = await supabase
    .from('liabilities')
    .insert([{ 
      name, 
      total_amount, 
      remaining_amount: total_amount, // initially, remaining is total
      start_date, 
      end_date 
    }])
    .select();
  if (error) throw error;
  return data;
};

export const updateLiability = async (id: string, updates: { name?: string, remaining_amount?: number, end_date?: string }) => {
  const { data, error } = await supabase.from('liabilities').update(updates).eq('id', id).select();
  if (error) throw error;
  return data;
};

// --- FUNDS ---
export const getFunds = async (): Promise<Fund[]> => {
  const { data, error } = await supabase.from('funds').select('*');
  if (error) throw error;
  return data;
};

export const createFund = async (name: string, target_amount: number, auto_add_monthly: number = 0): Promise<Fund[]> => {
  const { data, error } = await supabase
    .from('funds')
    .insert([{ name, target_amount, auto_add_monthly, current_balance: 0 }])
    .select();
  if (error) throw error;
  return data;
};

export const updateFund = async (id: string, updates: { name?: string, target_amount?: number, auto_add_monthly?: number }) => {
  const { data, error } = await supabase.from('funds').update(updates).eq('id', id).select();
  if (error) throw error;
  return data;
};

// --- FUND TRANSFERS ---
export const transferToFund = async (fund_id: string, account_id: string, amount: number): Promise<FundTransfer[]> => {
  const { data: transferData, error: transferError } = await supabase
    .from('fund_transfers')
    .insert([{ fund_id, account_id, amount }])
    .select();
  if (transferError) throw transferError;
  return transferData;
};

// --- REPORTS ---
export const getGroupSummary = async (groupId: string): Promise<GroupSummary> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('group_id', groupId);
    
  if (error) throw error;

  const summary = data.reduce((acc, curr) => {
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

export const getTransactionReport = async (filters: ReportFilters) => {
  let query = supabase
    .from('transactions')
    .select(`
      id,
      amount,
      type,
      transaction_date,
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

  return data;
};

// Utility to group data by time periods
export const aggregateReportData = (transactions: any[], timeframe: 'daily' | 'monthly' | 'annually') => {
  const aggregated = transactions.reduce((acc, current) => {
    let key = '';
    const date = new Date(current.transaction_date);

    // Determine the grouping key based on the requested timeframe
    if (timeframe === 'daily') {
      key = current.transaction_date; // 'YYYY-MM-DD'
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
