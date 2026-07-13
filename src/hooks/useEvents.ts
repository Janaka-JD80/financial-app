import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => api.getEvent(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => api.updateEvent(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useEventBudgets = (eventId: string) => {
  return useQuery({
    queryKey: ['eventBudgets', eventId],
    queryFn: () => api.getEventBudgets(eventId),
    enabled: !!eventId,
  });
};

export const useCreateEventBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createEventBudget,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['eventBudgets', variables.event_id] });
    },
  });
};

export const useDeleteEventBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, eventId }: { id: string; eventId: string }) => api.deleteEventBudget(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['eventBudgets', variables.eventId] });
    },
  });
};
