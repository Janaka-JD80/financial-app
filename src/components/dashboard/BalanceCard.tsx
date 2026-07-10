import { Card, CardContent } from '../ui/Card';
import { Wallet } from 'lucide-react';

interface BalanceCardProps {
  totalBalance: number;
}

export function BalanceCard({ totalBalance }: BalanceCardProps) {
  return (
    <Card className="bg-emerald-600 text-white border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1 select-none">Total Balance</p>
            <h2 className="text-3xl font-bold">${totalBalance.toFixed(2)}</h2>
          </div>
          <div className="p-3 bg-emerald-500 rounded-xl">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
