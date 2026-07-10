import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export const useFunds = () => useQuery({ queryKey: ['funds'], queryFn: api.getFunds });

export const useCreateFund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; target_amount: number; auto_add_monthly?: number }) => 
      api.createFund(params.name, params.target_amount, params.auto_add_monthly),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['funds'] }),
  });
};

export const useUpdateFund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; updates: { name?: string; target_amount?: number; auto_add_monthly?: number } }) => 
      api.updateFund(params.id, params.updates),
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
