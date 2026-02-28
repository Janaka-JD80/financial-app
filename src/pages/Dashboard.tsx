import { useAccounts, useTransactions } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { format } from 'date-fns';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Dashboard() {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: transactions, isLoading: loadingTransactions } = useTransactions();

  const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0;
  
  const recentTransactions = transactions?.slice(0, 5) || [];

  if (loadingAccounts || loadingTransactions) {
    return <div className="animate-pulse flex space-x-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Total Balance</p>
                <h2 className="text-3xl font-bold">${totalBalance.toFixed(2)}</h2>
              </div>
              <div className="p-3 bg-emerald-500 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <p className="font-medium text-zinc-900">{tx.description || tx.categories?.name || 'Transaction'}</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Accounts Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts?.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100">
                  <div>
                    <p className="font-medium text-zinc-900">{acc.name}</p>
                    <p className="text-xs text-zinc-500 capitalize">{acc.type}</p>
                  </div>
                  <div className="font-semibold text-zinc-900">
                    ${Number(acc.balance).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
