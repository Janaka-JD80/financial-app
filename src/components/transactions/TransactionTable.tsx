import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '../../types';

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
                {transactions.map((tx) => (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
