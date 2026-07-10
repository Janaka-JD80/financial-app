import { supabase } from '../lib/supabase';
import { Category } from '../types';

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
