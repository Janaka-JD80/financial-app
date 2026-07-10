import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import { Account } from '../../types';

interface AccountListProps {
  accounts: Account[] | undefined;
  onEdit: (id: string, currentName: string) => void;
  onDelete: (id: string) => void;
}

export function AccountList({ accounts, onEdit, onDelete }: AccountListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!accounts || accounts.length === 0 ? (
            <p className="text-zinc-500 text-sm">No accounts found.</p>
          ) : (
            accounts.map(acc => (
              <div key={acc.id} className="flex justify-between items-center p-4 border border-zinc-100 rounded-xl">
                <div>
                  <p className="font-medium">{acc.name}</p>
                  <p className="text-xs text-zinc-500 capitalize">{acc.type}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-bold">${Number(acc.balance).toFixed(2)}</p>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(acc.id, acc.name)}
                      className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                      title="Edit Account Name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(acc.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
