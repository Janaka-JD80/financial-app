import { useState, useMemo } from 'react';
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
  useUpdateGroup,
  useCreateTransfer,
  useUpdateTransfer,
  useDeleteTransfer
} from '../../hooks/useApi';
import { useEvents } from '../../hooks/useEvents';
import { TransactionForm } from '../../components/transactions/TransactionForm';
import { TransactionTable } from '../../components/transactions/TransactionTable';
import { CategoryManager } from '../../components/transactions/CategoryManager';
import { GroupManager } from '../../components/transactions/GroupManager';
import { Transaction } from '../../types';
import { isTransferTransaction, parseTransferDescription } from '../../lib/utils';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function Transactions() {
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  const { data: transactions, isLoading } = useTransactions(
    filterStartDate || undefined,
    filterEndDate || undefined
  );
  const { data: accounts } = useAccounts();
  const { data: incomeCategories } = useCategories('income');
  const { data: expenseCategories } = useCategories('expense');
  const { data: groups } = useActiveGroups();
  const { data: events } = useEvents();
 
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const createTransfer = useCreateTransfer();
  const updateTransfer = useUpdateTransfer();
  const deleteTransfer = useDeleteTransfer();
  const createGroup = useCreateGroup();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const deleteGroup = useDeleteGroup();
  const updateCategory = useUpdateCategory();
  const updateGroup = useUpdateGroup();
 
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
 
  const activeTx = transactions?.find(t => t.id === editingTransactionId) || null;
  const editingTransaction = useMemo(() => {
    if (!activeTx) return null;
    if (isTransferTransaction(activeTx)) {
      const transferInfo = parseTransferDescription(activeTx.description);
      const transferId = transferInfo?.transferId;
      
      // Find the sibling transaction
      const sibling = transactions?.find(
        t => t.id !== activeTx.id && parseTransferDescription(t.description)?.transferId === transferId
      );
      
      const expenseTx = activeTx.type === 'expense' ? activeTx : sibling;
      const incomeTx = activeTx.type === 'income' ? activeTx : sibling;

      return {
        ...activeTx,
        isTransfer: true,
        transferId,
        from_account_id: expenseTx?.account_id || '',
        to_account_id: incomeTx?.account_id || '',
        amount: activeTx.amount,
        userDescription: transferInfo?.userDescription || '',
      };
    }
    return activeTx;
  }, [activeTx, transactions]);
 
  const handleTransactionSubmit = (data: any) => {
    if (data.type === 'transfer') {
      const transferGroup = groups?.find(g => g.name.toLowerCase() === 'transfer');
      const groupId = transferGroup ? transferGroup.id : null;

      const fromAccountName = accounts?.find(a => a.id === data.account_id)?.name || 'Account';
      const toAccountName = accounts?.find(a => a.id === data.to_account_id)?.name || 'Account';
      const defaultDescription = `Transfer from ${fromAccountName} to ${toAccountName}`;

      if (editingTransactionId && editingTransaction && editingTransaction.isTransfer) {
        updateTransfer.mutate(
          {
            transferId: editingTransaction.transferId,
            updates: {
              from_account_id: data.account_id,
              to_account_id: data.to_account_id,
              amount: data.amount,
              transaction_date: data.transaction_date,
              description: defaultDescription,
              group_id: groupId,
            }
          },
          {
            onSuccess: () => setEditingTransactionId(null),
          }
        );
      } else {
        createTransfer.mutate(
          {
            from_account_id: data.account_id,
            to_account_id: data.to_account_id,
            amount: data.amount,
            transaction_date: data.transaction_date,
            description: defaultDescription,
            group_id: groupId,
          },
          {
            onSuccess: () => setType('expense'),
          }
        );
      }
    } else {
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
    }
  };
 
  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransactionId(tx.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  const handleDeleteTransaction = (id: string) => {
    const tx = transactions?.find(t => t.id === id);
    if (!tx) return;

    if (window.confirm('Are you sure you want to delete this transaction?')) {
      if (isTransferTransaction(tx)) {
        const transferInfo = parseTransferDescription(tx.description);
        if (transferInfo?.transferId) {
          deleteTransfer.mutate(transferInfo.transferId);
        } else {
          deleteTransaction.mutate(id);
        }
      } else {
        deleteTransaction.mutate(id);
      }
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
            events={events}
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

        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-zinc-100 shadow-sm">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              {(filterStartDate || filterEndDate) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFilterStartDate('');
                    setFilterEndDate('');
                  }}
                  className="text-xs h-10 px-4 rounded-xl border-zinc-200 text-zinc-500 hover:text-zinc-900"
                >
                  Clear
                </Button>
              )}
            </CardContent>
          </Card>

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
