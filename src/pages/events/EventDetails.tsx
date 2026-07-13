import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent, useEventBudgets, useCreateEventBudget, useDeleteEventBudget } from '../../hooks/useEvents';
import { useTransactions } from '../../hooks/useTransactions';
import { Calendar, Trash2, ArrowLeft, Plus, DollarSign, PiggyBank } from 'lucide-react';
import { format, eachDayOfInterval, parseISO } from 'date-fns';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading: isEventLoading } = useEvent(id!);
  const { data: budgets, isLoading: isBudgetsLoading } = useEventBudgets(id!);
  const { data: allTransactions, isLoading: isTxLoading } = useTransactions();

  const createBudget = useCreateEventBudget();
  const deleteBudget = useDeleteEventBudget();

  const [date, setDate] = useState('');
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');

  const eventTransactions = useMemo(() => {
    return allTransactions?.filter((tx) => tx.event_id === id && tx.type === 'expense') || [];
  }, [allTransactions, id]);

  const totalPlanned = useMemo(() => {
    return budgets?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  }, [budgets]);

  const totalActual = useMemo(() => {
    return eventTransactions.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  }, [eventTransactions]);

  if (isEventLoading || isBudgetsLoading || isTxLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center text-zinc-500 py-12">Event not found</div>;
  }

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !itemName || !amount) return;
    createBudget.mutate(
      {
        event_id: id!,
        budget_date: date,
        item_name: itemName,
        amount: Number(amount),
      },
      {
        onSuccess: () => {
          setItemName('');
          setAmount('');
        },
      }
    );
  };

  const eventDates = eachDayOfInterval({
    start: parseISO(event.start_date),
    end: parseISO(event.end_date),
  });

  // Group budgets by date
  const budgetsByDate = budgets?.reduce((acc, budget) => {
    if (!acc[budget.budget_date]) acc[budget.budget_date] = [];
    acc[budget.budget_date].push(budget);
    return acc;
  }, {} as Record<string, typeof budgets>);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/events')}
          className="p-2 text-zinc-400 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{event.name}</h1>
          <p className="text-sm text-zinc-500 flex items-center mt-1">
            <Calendar className="w-4 h-4 mr-1.5" />
            {format(parseISO(event.start_date), 'MMM d, yyyy')} - {format(parseISO(event.end_date), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-500">Total Planned Budget</h3>
            <PiggyBank className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-zinc-900">${totalPlanned.toFixed(2)}</p>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-500">Actual Expenses</h3>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-zinc-900">${totalActual.toFixed(2)}</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-500">Remaining Budget</h3>
            <DollarSign className={`w-5 h-5 ${totalPlanned - totalActual >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
          </div>
          <p className={`text-3xl font-bold ${totalPlanned - totalActual >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ${(totalPlanned - totalActual).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-zinc-200 bg-zinc-50/50">
          <h2 className="text-lg font-semibold text-zinc-900">Add Budget Item</h2>
          <form onSubmit={handleAddBudget} className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 mb-1">Date</label>
              <select
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select a date</option>
                {eventDates.map((d) => {
                  const dStr = format(d, 'yyyy-MM-dd');
                  return (
                    <option key={dStr} value={dStr}>
                      {format(d, 'MMM d, yyyy')}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex-[2]">
              <label className="block text-xs font-medium text-zinc-500 mb-1">Item Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Food, Beach"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 mb-1">Amount</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={createBudget.isPending}
                className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {createBudget.isPending ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>

        <div className="divide-y divide-zinc-200">
          {eventDates.map((d) => {
            const dStr = format(d, 'yyyy-MM-dd');
            const dayBudgets = budgetsByDate?.[dStr] || [];
            
            return (
              <div key={dStr} className="p-5">
                <h3 className="text-md font-semibold text-zinc-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
                  {format(d, 'EEEE, MMM d, yyyy')}
                </h3>
                
                {dayBudgets.length > 0 ? (
                  <div className="space-y-2">
                    {dayBudgets.map((budget) => (
                      <div key={budget.id} className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                        <span className="font-medium text-zinc-700">{budget.item_name}</span>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-emerald-600">${Number(budget.amount).toFixed(2)}</span>
                          <button
                            onClick={() => deleteBudget.mutate({ id: budget.id, eventId: event.id })}
                            className="text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 font-semibold text-zinc-900 border-t border-zinc-200 mt-2">
                      <span>Daily Total</span>
                      <span>${dayBudgets.reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 italic">No budget items planned for this day.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
