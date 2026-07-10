import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export const useAccounts = () => useQuery({ queryKey: ['accounts'], queryFn: api.getAccounts });

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; type: string; balance?: number }) => 
      api.createAccount(params.name, params.type, params.balance),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; updates: { name?: string; type?: string } }) => 
      api.updateAccount(params.id, params.updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
};
