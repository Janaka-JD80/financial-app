import { supabase } from '../lib/supabase';
import { Event, EventBudget, EventPayload, EventBudgetPayload } from '../types';

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data;
};

export const getEvent = async (id: string): Promise<Event> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createEvent = async (payload: EventPayload): Promise<Event> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('events')
    .insert([{ ...payload, user_id: user.user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEvent = async (id: string, updates: Partial<EventPayload>): Promise<Event> => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getEventBudgets = async (eventId: string): Promise<EventBudget[]> => {
  const { data, error } = await supabase
    .from('event_budgets')
    .select('*')
    .eq('event_id', eventId)
    .order('budget_date', { ascending: true });

  if (error) throw error;
  return data;
};

export const createEventBudget = async (payload: EventBudgetPayload): Promise<EventBudget> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('event_budgets')
    .insert([{ ...payload, user_id: user.user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEventBudget = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('event_budgets')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
