import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export const useActiveGroups = () => useQuery({ queryKey: ['groups'], queryFn: api.getActiveGroups });

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string; description?: string }) => 
      api.createGroup(params.name, params.description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; updates: { name?: string; description?: string; is_active?: boolean } }) => 
      api.updateGroup(params.id, params.updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteGroup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  });
};
