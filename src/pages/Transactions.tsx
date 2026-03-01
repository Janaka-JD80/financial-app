import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransactions, useCreateTransaction, useDeleteTransaction, useUpdateTransaction, useAccounts, useCategories, useActiveGroups, useCreateGroup, useCreateCategory, useDeleteCategory, useDeleteGroup, useUpdateCategory, useUpdateGroup } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { format } from 'date-fns';
import { Trash2, Edit2, X } from 'lucide-react';

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
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const createGroup = useCreateGroup();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const deleteGroup = useDeleteGroup();
  const updateCategory = useUpdateCategory();
  const updateGroup = useUpdateGroup();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [newGroupName, setNewGroupName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
      is_recurring: false,
    }
  });

  const isRecurring = watch('is_recurring');

  const onSubmit = (data: TransactionFormValues) => {
    if (editingTransactionId) {
      updateTransaction.mutate({ id: editingTransactionId, updates: data }, {
        onSuccess: () => {
          setEditingTransactionId(null);
          reset({
            ...data,
            amount: 0,
            description: '',
          });
        }
      });
    } else {
      createTransaction.mutate(data, {
        onSuccess: () => {
          reset({
            ...data,
            amount: 0,
            description: '',
          });
        }
      });
    }
  };

  const handleEditTransaction = (tx: any) => {
    setEditingTransactionId(tx.id);
    setType(tx.type as 'income' | 'expense');
    setValue('type', tx.type as 'income' | 'expense');
    setValue('amount', Number(tx.amount));
    setValue('account_id', tx.account_id);
    setValue('category_id', tx.category_id);
    setValue('group_id', tx.group_id || '');
    setValue('transaction_date', tx.transaction_date.split('T')[0]);
    setValue('description', tx.description || '');
    setValue('is_recurring', tx.is_recurring || false);
    setValue('recurrence_interval', tx.recurrence_interval || '');
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingTransactionId(null);
    reset({
      type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
      is_recurring: false,
      amount: 0,
      description: '',
      account_id: '',
      category_id: '',
      group_id: '',
    });
    setType('expense');
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction.mutate(id);
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      createGroup.mutate({ name: newGroupName.trim() }, {
        onSuccess: () => setNewGroupName('')
      });
    }
  };

  const handleDeleteGroup = (id: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      deleteGroup.mutate(id, {
        onError: (error: any) => alert(`Failed to delete group: ${error.message || 'Unknown error'}`)
      });
    }
  };

  const handleEditGroup = (id: string, currentName: string) => {
    const newName = window.prompt('Enter new group name:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateGroup.mutate({ id, updates: { name: newName.trim() } });
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createCategory.mutate({ name: newCategoryName.trim(), type }, {
        onSuccess: () => setNewCategoryName('')
      });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(id, {
        onError: (error: any) => alert(`Failed to delete category: ${error.message || 'Unknown error'}`)
      });
    }
  };

  const handleEditCategory = (id: string, currentName: string) => {
    const newName = window.prompt('Enter new category name:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateCategory.mutate({ id, name: newName.trim() });
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
              <CardTitle className="flex justify-between items-center">
                <span>{editingTransactionId ? 'Edit Transaction' : 'Add Transaction'}</span>
                {editingTransactionId && (
                  <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-700">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                )}
              </CardTitle>
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

                <Button type="submit" className="w-full" disabled={createTransaction.isPending || updateTransaction.isPending}>
                  {editingTransactionId 
                    ? (updateTransaction.isPending ? 'Updating...' : 'Update Transaction') 
                    : (createTransaction.isPending ? 'Saving...' : 'Save Transaction')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
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
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories?.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-2 bg-zinc-50 rounded-lg">
                      <span className="text-sm font-medium">{c.name}</span>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditCategory(c.id, c.name)}
                          className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCategory(c.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
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

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {groups?.map(g => (
                    <div key={g.id} className="flex justify-between items-center p-2 bg-zinc-50 rounded-lg">
                      <span className="text-sm font-medium">{g.name}</span>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditGroup(g.id, g.name)}
                          className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteGroup(g.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right rounded-r-xl">Actions</th>
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
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditTransaction(tx)}
                                className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                                title="Edit Transaction"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteTransaction(tx.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                title="Delete Transaction"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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
