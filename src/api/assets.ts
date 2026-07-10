import { supabase } from '../lib/supabase';
import { Asset } from '../types';

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
