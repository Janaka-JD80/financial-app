import { supabase } from '../lib/supabase';
import { Fund, FundTransfer } from '../types';

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

export const transferToFund = async (fund_id: string, account_id: string, amount: number): Promise<FundTransfer[]> => {
  const { data: transferData, error: transferError } = await supabase
    .from('fund_transfers')
    .insert([{ fund_id, account_id, amount }])
    .select();
  if (transferError) throw transferError;
  return transferData;
};
