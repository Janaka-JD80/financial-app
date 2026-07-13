import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';
import { Account, Category, TransactionGroup, Event } from '../../types';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  account_id: z.string().min(1, 'Account is required'),
  to_account_id: z.string().optional(),
  category_id: z.string().optional(),
  group_id: z.string().optional(),
  event_id: z.string().optional(),
  transaction_date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  is_recurring: z.boolean().optional(),
  recurrence_interval: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'transfer') {
    if (!data.to_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Destination account is required',
        path: ['to_account_id'],
      });
    } else if (data.account_id === data.to_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Source and destination accounts must be different',
        path: ['to_account_id'],
      });
    }
  } else {
    if (!data.category_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category is required',
        path: ['category_id'],
      });
    }
  }
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  accounts: Account[] | undefined;
  incomeCategories: Category[] | undefined;
  expenseCategories: Category[] | undefined;
  groups: TransactionGroup[] | undefined;
  events: Event[] | undefined;
  editingTransaction: any | null;
  type: 'income' | 'expense' | 'transfer';
  onTypeChange: (type: 'income' | 'expense' | 'transfer') => void;
  onCancelEdit: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function TransactionForm({
  accounts,
  incomeCategories,
  expenseCategories,
  groups,
  events,
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
      if (editingTransaction.isTransfer) {
        onTypeChange('transfer');
        reset({
          type: 'transfer',
          amount: Number(editingTransaction.amount),
          account_id: editingTransaction.from_account_id,
          to_account_id: editingTransaction.to_account_id,
          category_id: '',
          group_id: editingTransaction.group_id || '',
          event_id: editingTransaction.event_id || '',
          transaction_date: editingTransaction.transaction_date.split('T')[0],
          description: editingTransaction.userDescription || '',
          is_recurring: editingTransaction.is_recurring || false,
          recurrence_interval: editingTransaction.recurrence_interval || '',
        });
      } else {
        onTypeChange(editingTransaction.type);
        reset({
          type: editingTransaction.type,
          amount: Number(editingTransaction.amount),
          account_id: editingTransaction.account_id,
          category_id: editingTransaction.category_id || '',
          group_id: editingTransaction.group_id || '',
          event_id: editingTransaction.event_id || '',
          transaction_date: editingTransaction.transaction_date.split('T')[0],
          description: editingTransaction.description || '',
          is_recurring: editingTransaction.is_recurring || false,
          recurrence_interval: editingTransaction.recurrence_interval || '',
        });
      }
    } else {
      onTypeChange('expense');
      reset({
        type: 'expense',
        amount: 0,
        account_id: '',
        to_account_id: '',
        category_id: '',
        group_id: '',
        event_id: '',
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

  const handleTypeChange = (newType: 'income' | 'expense' | 'transfer') => {
    onTypeChange(newType);
    setValue('type', newType);
    if (newType !== 'transfer') {
      setValue('category_id', ''); // Reset category when switching type
    }
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
              className="flex-1 px-2"
              onClick={() => handleTypeChange('expense')}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? 'primary' : 'outline'}
              className="flex-1 px-2"
              onClick={() => handleTypeChange('income')}
            >
              Income
            </Button>
            <Button
              type="button"
              variant={type === 'transfer' ? 'secondary' : 'outline'}
              className="flex-1 px-2"
              onClick={() => handleTypeChange('transfer')}
            >
              Transfer
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
            label={type === 'transfer' ? 'From Account' : 'Account'}
            options={accounts?.map(a => ({ label: a.name, value: a.id })) || []}
            {...register('account_id')}
            error={errors.account_id?.message}
          />

          {type === 'transfer' && (
            <Select
              label="To Account"
              options={accounts?.map(a => ({ label: a.name, value: a.id })) || []}
              {...register('to_account_id')}
              error={errors.to_account_id?.message}
            />
          )}

          {type !== 'transfer' && (
            <Select
              label="Category"
              options={categories?.map(c => ({ label: c.name, value: c.id })) || []}
              {...register('category_id')}
              error={errors.category_id?.message}
            />
          )}

          {type !== 'transfer' && (
            <Select
              label="Group (Optional)"
              options={groups?.map(g => ({ label: g.name, value: g.id })) || []}
              {...register('group_id')}
              error={errors.group_id?.message}
            />
          )}

          {type !== 'transfer' && (
            <Select
              label="Event (Optional)"
              options={events?.map(e => ({ label: e.name, value: e.id })) || []}
              {...register('event_id')}
              error={errors.event_id?.message}
            />
          )}

          <Input
            label="Date"
            type="date"
            {...register('transaction_date')}
            error={errors.transaction_date?.message}
          />

          {type !== 'transfer' && (
            <Input
              label="Description"
              {...register('description')}
              error={errors.description?.message}
            />
          )}

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

