import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit2 } from 'lucide-react';
import { Fund } from '../../types';

interface FundListProps {
  funds: Fund[] | undefined;
  onEdit: (id: string, currentName: string) => void;
}

export function FundList({ funds, onEdit }: FundListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Funds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!funds || funds.length === 0 ? (
            <p className="text-zinc-500 text-sm">No funds found.</p>
          ) : (
            funds.map(fund => {
              const currentBalance = Number(fund.current_balance || 0);
              const targetAmount = Number(fund.target_amount || 0);
              const progressPercentage = targetAmount > 0 
                ? Math.min(100, (currentBalance / targetAmount) * 100) 
                : 0;

              return (
                <div key={fund.id} className="p-4 border border-zinc-100 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{fund.name}</p>
                    <div className="flex items-center space-x-4">
                      <p className="font-bold">${currentBalance.toFixed(2)} / ${targetAmount.toFixed(2)}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(fund.id, fund.name)}
                        className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                        title="Edit Fund Name"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
