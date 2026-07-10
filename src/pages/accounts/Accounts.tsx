import { useAccounts, useCreateAccount, useDeleteAccount, useUpdateAccount, useFunds, useCreateFund, useUpdateFund } from '../../hooks/useApi';
import { AccountForm } from '../../components/accounts/AccountForm';
import { AccountList } from '../../components/accounts/AccountList';
import { FundForm } from '../../components/funds/FundForm';
import { FundList } from '../../components/funds/FundList';

export default function Accounts() {
  const { data: accounts } = useAccounts();
  const { data: funds } = useFunds();
  
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();
  const updateAccount = useUpdateAccount();
  const createFund = useCreateFund();
  const updateFund = useUpdateFund();

  const handleAccountSubmit = (data: any) => {
    createAccount.mutate(data);
  };

  const handleFundSubmit = (data: any) => {
    createFund.mutate(data);
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
      <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Accounts & Funds</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <AccountForm onSubmit={handleAccountSubmit} isPending={createAccount.isPending} />
          <AccountList accounts={accounts} onEdit={handleEditAccount} onDelete={handleDeleteAccount} />
        </div>

        <div className="space-y-6">
          <FundForm onSubmit={handleFundSubmit} isPending={createFund.isPending} />
          <FundList funds={funds} onEdit={handleEditFund} />
        </div>
      </div>
    </div>
  );
}
