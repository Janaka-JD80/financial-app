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
