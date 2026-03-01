import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransactions, useCreateTransaction, useAccounts, useCategories, useActiveGroups, useCreateGroup, useCreateCategory } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { format } from 'date-fns';

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

export default function Transactions() {
  const { data: transactions, isLoading } = useTransactions();
  const { data: accounts } = useAccounts();
  const { data: incomeCategories } = useCategories('income');
  const { data: expenseCategories } = useCategories('expense');
  const { data: groups } = useActiveGroups();
  const createTransaction = useCreateTransaction();
  const createGroup = useCreateGroup();
  const createCategory = useCreateCategory();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [newGroupName, setNewGroupName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
      is_recurring: false,
    }
  });

  const isRecurring = watch('is_recurring');

  const onSubmit = (data: TransactionFormValues) => {
    createTransaction.mutate(data, {
      onSuccess: () => {
        reset({
          ...data,
          amount: 0,
          description: '',
        });
      }
    });
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      createGroup.mutate({ name: newGroupName.trim() }, {
        onSuccess: () => setNewGroupName('')
      });
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createCategory.mutate({ name: newCategoryName.trim(), type }, {
        onSuccess: () => setNewCategoryName('')
      });
    }
  };

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Transactions</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex space-x-2 mb-4">
                  <Button
                    type="button"
                    variant={type === 'expense' ? 'danger' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setType('expense');
                      reset({ ...watch(), type: 'expense', category_id: '' });
                    }}
                  >
                    Expense
                  </Button>
                  <Button
                    type="button"
                    variant={type === 'income' ? 'primary' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setType('income');
                      reset({ ...watch(), type: 'income', category_id: '' });
                    }}
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

                <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
                  {createTransaction.isPending ? 'Saving...' : 'Save Transaction'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <p className="text-xs text-zinc-500 mb-1">Creates a new {type} category</p>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="New category name" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={handleCreateCategory}
                    disabled={!newCategoryName.trim() || createCategory.isPending}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input 
                  placeholder="New group name" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || createGroup.isPending}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-zinc-500">
                    <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 rounded-xl">
                      <tr>
                        <th className="px-4 py-3 rounded-l-xl">Date</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Account</th>
                        <th className="px-4 py-3 text-right rounded-r-xl">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.map((tx) => (
                        <tr key={tx.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">{format(new Date(tx.transaction_date), 'MMM dd, yyyy')}</td>
                          <td className="px-4 py-4 font-medium text-zinc-900">{tx.description || '-'}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md text-xs font-medium">
                              {tx.categories?.name}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-zinc-600">{tx.accounts?.name}</td>
                          <td className={`px-4 py-4 text-right font-semibold whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                            {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
