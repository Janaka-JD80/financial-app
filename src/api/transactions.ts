import { supabase } from '../lib/supabase';
import { Transaction, TransactionPayload } from '../types';

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
