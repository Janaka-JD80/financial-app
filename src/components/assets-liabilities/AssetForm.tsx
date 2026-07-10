import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const assetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  purchase_value: z.number().min(0, 'Value must be positive'),
  monthly_decay: z.number().min(0, 'Decay must be positive'),
  purchase_date: z.string().min(1, 'Date is required'),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormProps {
  onSubmit: (data: AssetFormValues) => void;
  isPending: boolean;
}

export function AssetForm({ onSubmit, isPending }: AssetFormProps) {
  const { register, handleSubmit, reset } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: { purchase_value: 0, monthly_decay: 0, purchase_date: new Date().toISOString().split('T')[0] }
  });

  const handleFormSubmit = (data: AssetFormValues) => {
    onSubmit(data);
    reset({ name: '', purchase_value: 0, monthly_decay: 0, purchase_date: new Date().toISOString().split('T')[0] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Asset</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input label="Asset Name" {...register('name')} />
          <Input label="Purchase Value" type="number" step="0.01" {...register('purchase_value', { valueAsNumber: true })} />
          <Input label="Monthly Decay" type="number" step="0.01" {...register('monthly_decay', { valueAsNumber: true })} />
          <Input label="Purchase Date" type="date" {...register('purchase_date')} />
          <Button type="submit" className="w-full" disabled={isPending}>Add Asset</Button>
        </form>
      </CardContent>
    </Card>
  );
}
