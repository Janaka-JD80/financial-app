import { useAssets, useCreateAsset, useUpdateAsset, useLiabilities, useCreateLiability, useUpdateLiability } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInMonths } from 'date-fns';
import { Edit2 } from 'lucide-react';

const assetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  purchase_value: z.number().min(0, 'Value must be positive'),
  monthly_decay: z.number().min(0, 'Decay must be positive'),
  purchase_date: z.string().min(1, 'Date is required'),
});

const liabilitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  total_amount: z.number().min(0, 'Amount must be positive'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
});

export default function AssetsLiabilities() {
  const { data: assets } = useAssets();
  const { data: liabilities } = useLiabilities();
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const createLiability = useCreateLiability();
  const updateLiability = useUpdateLiability();

  const { register: registerAsset, handleSubmit: handleAssetSubmit, reset: resetAsset } = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: { purchase_value: 0, monthly_decay: 0, purchase_date: new Date().toISOString().split('T')[0] }
  });

  const { register: registerLiability, handleSubmit: handleLiabilitySubmit, reset: resetLiability } = useForm<z.infer<typeof liabilitySchema>>({
    resolver: zodResolver(liabilitySchema),
    defaultValues: { total_amount: 0, start_date: new Date().toISOString().split('T')[0], end_date: new Date().toISOString().split('T')[0] }
  });

  const onAssetSubmit = (data: z.infer<typeof assetSchema>) => {
    createAsset.mutate(data, { onSuccess: () => resetAsset() });
  };

  const onLiabilitySubmit = (data: z.infer<typeof liabilitySchema>) => {
    createLiability.mutate(data, { onSuccess: () => resetLiability() });
  };

  const calculateCurrentAssetValue = (asset: any) => {
    const monthsPassed = differenceInMonths(new Date(), new Date(asset.purchase_date));
    const currentValue = Number(asset.purchase_value) - (monthsPassed * Number(asset.monthly_decay));
    return Math.max(0, currentValue);
  };

  const handleEditAsset = (id: string, currentName: string) => {
    const newName = window.prompt('Enter new asset name:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateAsset.mutate({ id, updates: { name: newName.trim() } });
    }
  };

  const handleEditLiability = (id: string, currentName: string) => {
    const newName = window.prompt('Enter new liability name:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateLiability.mutate({ id, updates: { name: newName.trim() } });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">Assets & Liabilities</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssetSubmit(onAssetSubmit)} className="space-y-4">
                <Input label="Asset Name" {...registerAsset('name')} />
                <Input label="Purchase Value" type="number" step="0.01" {...registerAsset('purchase_value', { valueAsNumber: true })} />
                <Input label="Monthly Decay" type="number" step="0.01" {...registerAsset('monthly_decay', { valueAsNumber: true })} />
                <Input label="Purchase Date" type="date" {...registerAsset('purchase_date')} />
                <Button type="submit" disabled={createAsset.isPending}>Add Asset</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets?.map(asset => (
                  <div key={asset.id} className="p-4 border border-zinc-100 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{asset.name}</p>
                      <div className="flex items-center space-x-4">
                        <p className="font-bold text-emerald-600">${calculateCurrentAssetValue(asset).toFixed(2)}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditAsset(asset.id, asset.name)}
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liabilities Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLiabilitySubmit(onLiabilitySubmit)} className="space-y-4">
                <Input label="Liability Name" {...registerLiability('name')} />
                <Input label="Total Amount" type="number" step="0.01" {...registerLiability('total_amount', { valueAsNumber: true })} />
                <Input label="Start Date" type="date" {...registerLiability('start_date')} />
                <Input label="End Date" type="date" {...registerLiability('end_date')} />
                <Button type="submit" disabled={createLiability.isPending}>Add Liability</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liabilities?.map(liability => (
                  <div key={liability.id} className="p-4 border border-zinc-100 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{liability.name}</p>
                      <div className="flex items-center space-x-4">
                        <p className="font-bold text-red-600">${Number(liability.remaining_amount).toFixed(2)}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditLiability(liability.id, liability.name)}
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
