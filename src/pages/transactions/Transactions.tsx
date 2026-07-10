import { useState } from 'react';
import { 
  useTransactions, 
  useCreateTransaction, 
  useDeleteTransaction, 
  useUpdateTransaction, 
  useAccounts, 
  useCategories, 
  useActiveGroups, 
  useCreateGroup, 
  useCreateCategory, 
  useDeleteCategory, 
  useDeleteGroup, 
  useUpdateCategory, 
  useUpdateGroup 
} from '../../hooks/useApi';
import { TransactionForm } from '../../components/transactions/TransactionForm';
import { TransactionTable } from '../../components/transactions/TransactionTable';
import { CategoryManager } from '../../components/transactions/CategoryManager';
import { GroupManager } from '../../components/transactions/GroupManager';
import { Transaction } from '../../types';

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
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  const editingTransaction = transactions?.find(t => t.id === editingTransactionId) || null;

  const handleTransactionSubmit = (data: any) => {
    if (editingTransactionId) {
      updateTransaction.mutate(
        { id: editingTransactionId, updates: data },
        {
          onSuccess: () => setEditingTransactionId(null),
        }
      );
    } else {
      createTransaction.mutate(data);
    }
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransactionId(tx.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction.mutate(id);
    }
  };

  const handleCreateGroup = (name: string) => {
    createGroup.mutate({ name });
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

  const handleCreateCategory = (name: string) => {
    createCategory.mutate({ name, type });
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
          <TransactionForm
            accounts={accounts}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
            groups={groups}
            editingTransaction={editingTransaction}
            type={type}
            onTypeChange={setType}
            onCancelEdit={() => setEditingTransactionId(null)}
            onSubmit={handleTransactionSubmit}
            isPending={createTransaction.isPending || updateTransaction.isPending}
          />

          <CategoryManager
            categories={categories}
            type={type}
            onAdd={handleCreateCategory}
            onDelete={handleDeleteCategory}
            onEdit={handleEditCategory}
            isPending={createCategory.isPending}
          />

          <GroupManager
            groups={groups}
            onAdd={handleCreateGroup}
            onDelete={handleDeleteGroup}
            onEdit={handleEditGroup}
            isPending={createGroup.isPending}
          />
        </div>

        <div className="lg:col-span-2">
          <TransactionTable
            transactions={transactions}
            isLoading={isLoading}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}
