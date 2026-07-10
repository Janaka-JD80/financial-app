import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export const useLiabilities = () => useQuery({ queryKey: ['liabilities'], queryFn: api.getLiabilities });

export const useCreateLiability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; total_amount: number; start_date: string; end_date: string }) => 
      api.createLiability(params.name, params.total_amount, params.start_date, params.end_date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }),
  });
};

export const useUpdateLiability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; updates: { name?: string; remaining_amount?: number; end_date?: string } }) => 
      api.updateLiability(params.id, params.updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }),
  });
};
