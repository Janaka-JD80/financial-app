import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';

const accountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['cash', 'bank', 'wallet']),
  balance: z.number().min(0, 'Balance must be positive'),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountFormProps {
  onSubmit: (data: AccountFormValues) => void;
  isPending: boolean;
}

export function AccountForm({ onSubmit, isPending }: AccountFormProps) {
  const { register, handleSubmit, reset } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { type: 'bank', balance: 0 }
  });

  const handleFormSubmit = (data: AccountFormValues) => {
    onSubmit(data);
    reset({ name: '', type: 'bank', balance: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input label="Account Name" {...register('name')} />
          <Select
            label="Type"
            options={[
              { label: 'Bank', value: 'bank' },
              { label: 'Cash', value: 'cash' },
              { label: 'Wallet', value: 'wallet' },
            ]}
            {...register('type')}
          />
          <Input label="Initial Balance" type="number" step="0.01" {...register('balance', { valueAsNumber: true })} />
          <Button type="submit" className="w-full" disabled={isPending}>Add Account</Button>
        </form>
      </CardContent>
    </Card>
  );
}
