import { supabase } from '../lib/supabase';
import { TransactionGroup } from '../types';

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
