import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export const useAssets = () => useQuery({ queryKey: ['assets'], queryFn: api.getAssets });

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; purchase_value: number; monthly_decay: number; purchase_date: string }) => 
      api.createAsset(params.name, params.purchase_value, params.monthly_decay, params.purchase_date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; updates: { name?: string; monthly_decay?: number } }) => 
      api.updateAsset(params.id, params.updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });
};
