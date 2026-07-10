import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Account } from '../../types';

interface AccountsOverviewProps {
  accounts: Account[] | undefined;
}

export function AccountsOverview({ accounts }: AccountsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {!accounts || accounts.length === 0 ? (
          <p className="text-zinc-500 text-sm">No accounts found.</p>
        ) : (
          <div className="space-y-4">
            {accounts.map((acc) => (
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
        )}
      </CardContent>
    </Card>
  );
}
