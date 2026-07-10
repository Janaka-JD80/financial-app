import { supabase } from '../lib/supabase';
import { Liability } from '../types';

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
      remaining_amount: total_amount,
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
