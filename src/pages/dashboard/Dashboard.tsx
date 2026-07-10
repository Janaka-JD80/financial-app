import { useAccounts, useTransactions } from '../../hooks/useApi';
import { BalanceCard } from '../../components/dashboard/BalanceCard';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { AccountsOverview } from '../../components/dashboard/AccountsOverview';

export default function Dashboard() {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: transactions, isLoading: loadingTransactions } = useTransactions();

  const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0;

  if (loadingAccounts || loadingTransactions) {
    return (
      <div className="animate-pulse flex flex-col space-y-6">
        <div className="sr-only">Loading...</div>
        <div className="h-8 bg-zinc-200 rounded-md w-1/4"></div>
        <div className="h-32 bg-zinc-200 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-zinc-200 rounded-2xl"></div>
          <div className="h-64 bg-zinc-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard totalBalance={totalBalance} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions} />
        <AccountsOverview accounts={accounts} />
      </div>
    </div>
  );
}
