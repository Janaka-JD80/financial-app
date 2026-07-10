import { supabase } from '../lib/supabase';
import { Account } from '../types';

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
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
