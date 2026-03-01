import { useAccounts, useCreateAccount, useDeleteAccount, useUpdateAccount, useFunds, useCreateFund, useUpdateFund } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, Edit2 } from 'lucide-react';

const accountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['cash', 'bank', 'wallet']),
  balance: z.number().min(0, 'Balance must be positive'),
});

const fundSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  target_amount: z.number().min(0, 'Target must be positive'),
  auto_add_monthly: z.number().min(0).optional(),
});

export default function Accounts() {
  const { data: accounts } = useAccounts();
  const { data: funds } = useFunds();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();
  const updateAccount = useUpdateAccount();
  const createFund = useCreateFund();
  const updateFund = useUpdateFund();

  const { register: registerAccount, handleSubmit: handleAccountSubmit, reset: resetAccount } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: { type: 'bank', balance: 0 }
  });

  const { register: registerFund, handleSubmit: handleFundSubmit, reset: resetFund } = useForm<z.infer<typeof fundSchema>>({
    resolver: zodResolver(fundSchema),
    defaultValues: { target_amount: 0, auto_add_monthly: 0 }
  });

  const onAccountSubmit = (data: z.infer<typeof accountSchema>) => {
    createAccount.mutate(data, { onSuccess: () => resetAccount() });
  };

  const onFundSubmit = (data: z.infer<typeof fundSchema>) => {
    createFund.mutate(data, { onSuccess: () => resetFund() });
  };

  const handleDeleteAccount = (id: string) => {
    if (window.confirm('Are you sure you want to delete this account? Note: This will fail if there are transactions linked to this account.')) {
      deleteAccount.mutate(id, {
        onError: (error: any) => {
          alert(`Failed to delete account: ${error.message || 'Unknown error'}`);
        }
      });
    }
  };

  const handleEditAccount = (id: string, currentName: string) => {
    const newName = window.prompt('Enter new account name:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateAccount.mutate({ id, updates: { name: newName.trim() } });
    }
  };

  const handleEditFund = (id: string, currentName: string) => {
    const newName = window.prompt('Enter new fund name:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateFund.mutate({ id, updates: { name: newName.trim() } });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">Accounts & Funds</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSubmit(onAccountSubmit)} className="space-y-4">
                <Input label="Account Name" {...registerAccount('name')} />
                <Select
                  label="Type"
                  options={[
                    { label: 'Bank', value: 'bank' },
                    { label: 'Cash', value: 'cash' },
                    { label: 'Wallet', value: 'wallet' },
                  ]}
                  {...registerAccount('type')}
                />
                <Input label="Initial Balance" type="number" step="0.01" {...registerAccount('balance', { valueAsNumber: true })} />
                <Button type="submit" disabled={createAccount.isPending}>Add Account</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts?.map(acc => (
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
                          onClick={() => handleEditAccount(acc.id, acc.name)}
                          className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                          title="Edit Account Name"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteAccount(acc.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funds Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Fund</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFundSubmit(onFundSubmit)} className="space-y-4">
                <Input label="Fund Name" {...registerFund('name')} />
                <Input label="Target Amount" type="number" step="0.01" {...registerFund('target_amount', { valueAsNumber: true })} />
                <Input label="Auto Add Monthly" type="number" step="0.01" {...registerFund('auto_add_monthly', { valueAsNumber: true })} />
                <Button type="submit" disabled={createFund.isPending}>Create Fund</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funds?.map(fund => (
                  <div key={fund.id} className="p-4 border border-zinc-100 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{fund.name}</p>
                      <div className="flex items-center space-x-4">
                        <p className="font-bold">${Number(fund.current_balance).toFixed(2)} / ${Number(fund.target_amount).toFixed(2)}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditFund(fund.id, fund.name)}
                          className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                          title="Edit Fund Name"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (Number(fund.current_balance) / Number(fund.target_amount)) * 100)}%` }}
                      ></div>
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
