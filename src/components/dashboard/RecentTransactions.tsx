import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '../../types';
import { getCleanDescription } from '../../lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[] | undefined;
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="text-zinc-500 text-sm">No recent transactions.</p>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">
                      {getCleanDescription(tx.description, tx.categories?.name || 'Transaction')}
                    </p>
                    <p className="text-xs text-zinc-500">{format(new Date(tx.transaction_date), 'MMM dd, yyyy')} • {tx.accounts?.name}</p>
                  </div>
                </div>
                <div className={`font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                  {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
