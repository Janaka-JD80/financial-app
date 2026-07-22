import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '../../types';
import { isTransferTransaction, getCleanDescription } from '../../lib/utils';

interface TransactionTableProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, isLoading, onEdit, onDelete }: TransactionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-zinc-500 text-sm">Loading transactions...</p>
        ) : !transactions || transactions.length === 0 ? (
          <p className="text-zinc-500 text-sm">No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                  {transactions.map((tx) => {
                    const isTxTransfer = isTransferTransaction(tx);
                    const displayDescription = getCleanDescription(tx.description, '-');

                    return (
                      <tr key={tx.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">{format(new Date(tx.transaction_date), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-4 font-medium text-zinc-900">{displayDescription}</td>
                        <td className="px-4 py-4">
                          {isTxTransfer ? (
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-semibold uppercase tracking-wider inline-flex items-center">
                              Transfer
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md text-xs font-medium">
                              {tx.categories?.name || '-'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-zinc-600">{tx.accounts?.name}</td>
                        <td className={`px-4 py-4 text-right font-semibold whitespace-nowrap ${
                          isTxTransfer 
                            ? 'text-indigo-600' 
                            : tx.type === 'income' 
                              ? 'text-emerald-600' 
                              : 'text-zinc-900'
                        }`}>
                          <span className="inline-flex items-center gap-1 justify-end w-full">
                            {isTxTransfer && <span className="text-xs text-indigo-400">⇄</span>}
                            <span>{tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => onEdit(tx)}
                              className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                              title="Edit Transaction"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => onDelete(tx.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {transactions.map((tx) => {
                const isTxTransfer = isTransferTransaction(tx);
                const displayDescription = getCleanDescription(tx.description, '-');

                return (
                  <div key={tx.id} className="p-4 border border-zinc-100 rounded-2xl bg-zinc-50/30 hover:bg-zinc-50 transition-all duration-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-semibold text-zinc-900 text-sm leading-tight">{displayDescription}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          {format(new Date(tx.transaction_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`font-bold text-sm whitespace-nowrap ${
                        isTxTransfer 
                          ? 'text-indigo-600' 
                          : tx.type === 'income' 
                            ? 'text-emerald-600' 
                            : 'text-zinc-900'
                      }`}>
                        <span className="inline-flex items-center gap-1">
                          {isTxTransfer && <span className="text-[10px]">⇄</span>}
                          <span>{tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}</span>
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100/50">
                      <div className="flex items-center gap-1.5">
                        {isTxTransfer ? (
                          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase tracking-wider">
                            Transfer
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[9px] font-semibold">
                            {tx.categories?.name || 'Uncategorized'}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-500 font-medium">
                          • {tx.accounts?.name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(tx)}
                          className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDelete(tx.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

