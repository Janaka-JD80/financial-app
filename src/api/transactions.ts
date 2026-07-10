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

export const createTransfer = async (params: {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  transaction_date: string;
  description?: string;
  group_id?: string | null;
}): Promise<Transaction[]> => {
  const transferId = crypto.randomUUID();
  const descPrefix = `[Transfer: ${transferId}]`;
  const userDesc = params.description ? `${descPrefix} ${params.description}` : descPrefix;

  const payloads = [
    {
      account_id: params.from_account_id,
      amount: params.amount,
      type: 'expense',
      transaction_date: params.transaction_date,
      description: `${userDesc} (to Account)`,
      group_id: params.group_id || null,
      category_id: null,
    },
    {
      account_id: params.to_account_id,
      amount: params.amount,
      type: 'income',
      transaction_date: params.transaction_date,
      description: `${userDesc} (from Account)`,
      group_id: params.group_id || null,
      category_id: null,
    }
  ];

  const { data, error } = await supabase
    .from('transactions')
    .insert(payloads)
    .select();
  if (error) throw error;
  return data;
};

export const updateTransfer = async (
  transferId: string,
  params: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    transaction_date: string;
    description?: string;
    group_id?: string | null;
  }
): Promise<void> => {
  const { data: txs, error: fetchErr } = await supabase
    .from('transactions')
    .select('*')
    .like('description', `%[Transfer: ${transferId}]%`);

  if (fetchErr) throw fetchErr;
  if (!txs || txs.length !== 2) {
    throw new Error('Could not find the paired transfer transactions to update.');
  }

  const expenseTx = txs.find(t => t.type === 'expense');
  const incomeTx = txs.find(t => t.type === 'income');

  if (!expenseTx || !incomeTx) {
    throw new Error('Invalid transfer transaction pairs found.');
  }

  const descPrefix = `[Transfer: ${transferId}]`;
  const userDesc = params.description ? `${descPrefix} ${params.description}` : descPrefix;

  const updatePromises = [
    supabase.from('transactions').update({
      account_id: params.from_account_id,
      amount: params.amount,
      transaction_date: params.transaction_date,
      description: `${userDesc} (to Account)`,
      group_id: params.group_id || null,
      category_id: null,
    }).eq('id', expenseTx.id),

    supabase.from('transactions').update({
      account_id: params.to_account_id,
      amount: params.amount,
      transaction_date: params.transaction_date,
      description: `${userDesc} (from Account)`,
      group_id: params.group_id || null,
      category_id: null,
    }).eq('id', incomeTx.id)
  ];

  const results = await Promise.all(updatePromises);
  for (const res of results) {
    if (res.error) throw res.error;
  }
};

export const deleteTransfer = async (transferId: string): Promise<void> => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .like('description', `%[Transfer: ${transferId}]%`);
  if (error) throw error;
};

