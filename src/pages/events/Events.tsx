import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents, useCreateEvent, useDeleteEvent } from '../../hooks/useEvents';
import { Calendar, Plus, Trash2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Events() {
  const { data: events, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return;

    createEvent.mutate(
      { name, start_date: startDate, end_date: endDate },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setName('');
          setStartDate('');
          setEndDate('');
        },
      }
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this event? This will also remove its budget plan.')) {
      deleteEvent.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Event Budgets</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group block bg-white border border-zinc-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <button
                onClick={(e) => handleDelete(event.id, e)}
                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">{event.name}</h3>
            <p className="text-sm text-zinc-500 flex items-center">
              {format(new Date(event.start_date), 'MMM d, yyyy')} - {format(new Date(event.end_date), 'MMM d, yyyy')}
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-center text-sm font-medium text-emerald-600">
              <span>View Plan</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
        {events?.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-200 rounded-2xl">
            <Calendar className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
            <p>No events planned yet.</p>
            <p className="text-sm mt-1">Create one to start budgeting!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="e.g. Summer Vacation"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createEvent.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  {createEvent.isPending ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
