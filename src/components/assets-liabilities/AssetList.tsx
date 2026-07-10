import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit2 } from 'lucide-react';
import { format, differenceInMonths } from 'date-fns';
import { Asset } from '../../types';

interface AssetListProps {
  assets: Asset[] | undefined;
  onEdit: (id: string, currentName: string) => void;
}

export function AssetList({ assets, onEdit }: AssetListProps) {
  const calculateCurrentAssetValue = (asset: Asset) => {
    const monthsPassed = differenceInMonths(new Date(), new Date(asset.purchase_date));
    const currentValue = Number(asset.purchase_value) - (monthsPassed * Number(asset.monthly_decay));
    return Math.max(0, currentValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!assets || assets.length === 0 ? (
            <p className="text-zinc-500 text-sm">No assets found.</p>
          ) : (
            assets.map(asset => (
              <div key={asset.id} className="p-4 border border-zinc-100 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{asset.name}</p>
                  <div className="flex items-center space-x-4">
                    <p className="font-bold text-emerald-600">${calculateCurrentAssetValue(asset).toFixed(2)}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(asset.id, asset.name)}
                      className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                      title="Edit Asset Name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Purchased: {format(new Date(asset.purchase_date), 'MMM yyyy')}</span>
                  <span>Original: ${Number(asset.purchase_value).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
