import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const fundSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  target_amount: z.number().min(0, 'Target must be positive'),
  auto_add_monthly: z.number().min(0).optional(),
});

type FundFormValues = z.infer<typeof fundSchema>;

interface FundFormProps {
  onSubmit: (data: FundFormValues) => void;
  isPending: boolean;
}

export function FundForm({ onSubmit, isPending }: FundFormProps) {
  const { register, handleSubmit, reset } = useForm<FundFormValues>({
    resolver: zodResolver(fundSchema),
    defaultValues: { target_amount: 0, auto_add_monthly: 0 }
  });

  const handleFormSubmit = (data: FundFormValues) => {
    onSubmit(data);
    reset({ name: '', target_amount: 0, auto_add_monthly: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Fund</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input label="Fund Name" {...register('name')} />
          <Input label="Target Amount" type="number" step="0.01" {...register('target_amount', { valueAsNumber: true })} />
          <Input label="Auto Add Monthly" type="number" step="0.01" {...register('auto_add_monthly', { valueAsNumber: true })} />
          <Button type="submit" className="w-full" disabled={isPending}>Create Fund</Button>
        </form>
      </CardContent>
    </Card>
  );
}
