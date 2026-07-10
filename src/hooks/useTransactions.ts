import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

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

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; updates: any }) => 
      api.updateTransaction(params.id, params.updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  });
};
