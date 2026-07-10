import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const liabilitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  total_amount: z.number().min(0, 'Amount must be positive'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
});

type LiabilityFormValues = z.infer<typeof liabilitySchema>;

interface LiabilityFormProps {
  onSubmit: (data: LiabilityFormValues) => void;
  isPending: boolean;
}

export function LiabilityForm({ onSubmit, isPending }: LiabilityFormProps) {
  const { register, handleSubmit, reset } = useForm<LiabilityFormValues>({
    resolver: zodResolver(liabilitySchema),
    defaultValues: { total_amount: 0, start_date: new Date().toISOString().split('T')[0], end_date: new Date().toISOString().split('T')[0] }
  });

  const handleFormSubmit = (data: LiabilityFormValues) => {
    onSubmit(data);
    reset({ name: '', total_amount: 0, start_date: new Date().toISOString().split('T')[0], end_date: new Date().toISOString().split('T')[0] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Liability</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input label="Liability Name" {...register('name')} />
          <Input label="Total Amount" type="number" step="0.01" {...register('total_amount', { valueAsNumber: true })} />
          <Input label="Start Date" type="date" {...register('start_date')} />
          <Input label="End Date" type="date" {...register('end_date')} />
          <Button type="submit" className="w-full" disabled={isPending}>Add Liability</Button>
        </form>
      </CardContent>
    </Card>
  );
}
