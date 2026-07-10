import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { Liability } from '../../types';

interface LiabilityListProps {
  liabilities: Liability[] | undefined;
  onEdit: (id: string, currentName: string) => void;
}

export function LiabilityList({ liabilities, onEdit }: LiabilityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Liabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!liabilities || liabilities.length === 0 ? (
            <p className="text-zinc-500 text-sm">No liabilities found.</p>
          ) : (
            liabilities.map(liability => (
              <div key={liability.id} className="p-4 border border-zinc-100 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{liability.name}</p>
                  <div className="flex items-center space-x-4">
                    <p className="font-bold text-red-600">${Number(liability.remaining_amount).toFixed(2)}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(liability.id, liability.name)}
                      className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                      title="Edit Liability Name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Ends: {format(new Date(liability.end_date), 'MMM yyyy')}</span>
                  <span>Total: ${Number(liability.total_amount).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
