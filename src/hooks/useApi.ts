import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

// Accounts
export const useAccounts = () => useQuery({ queryKey: ['accounts'], queryFn: api.getAccounts });
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; type: string; balance?: number }) => api.createAccount(params.name, params.type, params.balance),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
};

// Categories
export const useCategories = (type?: 'income' | 'expense') => useQuery({ queryKey: ['categories', type], queryFn: () => api.getCategories(type) });

// Groups
export const useActiveGroups = () => useQuery({ queryKey: ['groups'], queryFn: api.getActiveGroups });
export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; description?: string }) => api.createGroup(params.name, params.description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  });
};

// Transactions
export const useTransactions = (startDate?: string, endDate?: string) => useQuery({
  queryKey: ['transactions', startDate, endDate],
  queryFn: () => api.getTransactions(startDate, endDate)
});
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  });
};

// Assets
export const useAssets = () => useQuery({ queryKey: ['assets'], queryFn: api.getAssets });
export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; purchase_value: number; monthly_decay: number; purchase_date: string }) => 
      api.createAsset(params.name, params.purchase_value, params.monthly_decay, params.purchase_date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });
};

// Liabilities
export const useLiabilities = () => useQuery({ queryKey: ['liabilities'], queryFn: api.getLiabilities });
export const useCreateLiability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; total_amount: number; start_date: string; end_date: string }) => 
      api.createLiability(params.name, params.total_amount, params.start_date, params.end_date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }),
  });
};

// Funds
export const useFunds = () => useQuery({ queryKey: ['funds'], queryFn: api.getFunds });
export const useCreateFund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; target_amount: number; auto_add_monthly?: number }) => 
      api.createFund(params.name, params.target_amount, params.auto_add_monthly),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['funds'] }),
  });
};
export const useTransferToFund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { fund_id: string; account_id: string; amount: number }) => 
      api.transferToFund(params.fund_id, params.account_id, params.amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

// Reports
export const useGroupSummary = (groupId: string) => useQuery({
  queryKey: ['groupSummary', groupId],
  queryFn: () => api.getGroupSummary(groupId),
  enabled: !!groupId,
});
