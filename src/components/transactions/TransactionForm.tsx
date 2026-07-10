import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';
import { Account, Category, TransactionGroup } from '../../types';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  account_id: z.string().min(1, 'Account is required'),
  category_id: z.string().min(1, 'Category is required'),
  group_id: z.string().optional(),
  transaction_date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  is_recurring: z.boolean().optional(),
  recurrence_interval: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  accounts: Account[] | undefined;
  incomeCategories: Category[] | undefined;
  expenseCategories: Category[] | undefined;
  groups: TransactionGroup[] | undefined;
  editingTransaction: any | null;
  type: 'income' | 'expense';
  onTypeChange: (type: 'income' | 'expense') => void;
  onCancelEdit: () => void;
  onSubmit: (data: TransactionFormValues) => void;
  isPending: boolean;
}

export function TransactionForm({
  accounts,
  incomeCategories,
  expenseCategories,
  groups,
  editingTransaction,
  type,
  onTypeChange,
  onCancelEdit,
  onSubmit,
  isPending,
}: TransactionFormProps) {

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
      is_recurring: false,
    }
  });

  const isRecurring = watch('is_recurring');

  useEffect(() => {
    if (editingTransaction) {
      onTypeChange(editingTransaction.type);
      reset({
        type: editingTransaction.type,
        amount: Number(editingTransaction.amount),
        account_id: editingTransaction.account_id,
        category_id: editingTransaction.category_id,
        group_id: editingTransaction.group_id || '',
        transaction_date: editingTransaction.transaction_date.split('T')[0],
        description: editingTransaction.description || '',
        is_recurring: editingTransaction.is_recurring || false,
        recurrence_interval: editingTransaction.recurrence_interval || '',
      });
    } else {
      onTypeChange('expense');
      reset({
        type: 'expense',
        amount: 0,
        account_id: '',
        category_id: '',
        group_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
        description: '',
        is_recurring: false,
        recurrence_interval: '',
      });
    }
  }, [editingTransaction, reset, onTypeChange]);

  const handleFormSubmit = (data: TransactionFormValues) => {
    onSubmit(data);
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    onTypeChange(newType);
    setValue('type', newType);
    setValue('category_id', ''); // Reset category when switching type
  };

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</span>
          {editingTransaction && (
            <Button variant="ghost" size="sm" onClick={onCancelEdit} className="text-zinc-500 hover:text-zinc-700">
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              variant={type === 'expense' ? 'danger' : 'outline'}
              className="flex-1"
              onClick={() => handleTypeChange('expense')}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? 'primary' : 'outline'}
              className="flex-1"
              onClick={() => handleTypeChange('income')}
            >
              Income
            </Button>
          </div>

          <Input
            label="Amount"
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            error={errors.amount?.message}
          />

          <Select
            label="Account"
            options={accounts?.map(a => ({ label: a.name, value: a.id })) || []}
            {...register('account_id')}
            error={errors.account_id?.message}
          />

          <Select
            label="Category"
            options={categories?.map(c => ({ label: c.name, value: c.id })) || []}
            {...register('category_id')}
            error={errors.category_id?.message}
          />

          <Select
            label="Group (Optional)"
            options={groups?.map(g => ({ label: g.name, value: g.id })) || []}
            {...register('group_id')}
            error={errors.group_id?.message}
          />

          <Input
            label="Date"
            type="date"
            {...register('transaction_date')}
            error={errors.transaction_date?.message}
          />

          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_recurring"
              className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              {...register('is_recurring')}
            />
            <label htmlFor="is_recurring" className="text-sm text-zinc-700">
              Is Recurring?
            </label>
          </div>

          {isRecurring && (
            <Select
              label="Interval"
              options={[
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Annually', value: 'annually' },
              ]}
              {...register('recurrence_interval')}
            />
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {editingTransaction 
              ? (isPending ? 'Updating...' : 'Update Transaction') 
              : (isPending ? 'Saving...' : 'Save Transaction')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
