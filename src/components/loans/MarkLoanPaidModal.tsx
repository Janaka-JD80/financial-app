import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '../../types';
import { Button } from '../ui/Button';
import { createTransaction, linkLoanPayback } from '../../api/transactions';
import { getCategories, createCategory } from '../../api/categories';
import { parseLoanPaybackDescription } from '../../lib/utils';

interface MarkLoanPaidModalProps {
  loan: Transaction;
  allPaybacks: Transaction[];
  onClose: () => void;
  onSuccess: () => void;
}

export function MarkLoanPaidModal({ loan, allPaybacks, onClose, onSuccess }: MarkLoanPaidModalProps) {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [selectedPaybackId, setSelectedPaybackId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter paybacks to only those that are NOT already linked to another loan
  const unlinkedPaybacks = allPaybacks.filter(pb => {
    return !parseLoanPaybackDescription(pb.description);
  });

  const handleCreateNew = async () => {
    setIsSubmitting(true);
    try {
      // Find or create 'Payback' category
      let categories = await getCategories('income');
      let paybackCat = categories.find(c => c.name.toLowerCase() === 'payback');
      
      if (!paybackCat) {
        const newCats = await createCategory('Payback', 'income');
        paybackCat = newCats[0];
      }

      const today = new Date().toISOString().split('T')[0];
      
      await createTransaction({
        account_id: loan.account_id,
        category_id: paybackCat.id,
        group_id: null,
        type: 'income',
        amount: loan.amount,
        transaction_date: today,
        description: `[LoanPayback: ${loan.id}] Paid`,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to record new payback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkExisting = async () => {
    if (!selectedPaybackId) return;
    setIsSubmitting(true);
    try {
      const pb = unlinkedPaybacks.find(p => p.id === selectedPaybackId);
      if (!pb) throw new Error('Payback not found');
      
      await linkLoanPayback(loan.id, pb.id, pb.description || '');
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to link existing payback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h3 className="text-lg font-bold text-zinc-900">Mark Loan as Paid</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-100 bg-zinc-50">
          <p className="text-sm font-medium text-zinc-700">Loan Details</p>
          <p className="text-lg font-bold text-zinc-900 mt-1">${Number(loan.amount).toFixed(2)}</p>
          <p className="text-sm text-zinc-500">{loan.description || 'Loan'} • {format(new Date(loan.transaction_date), 'MMM dd, yyyy')}</p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex space-x-2 bg-zinc-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setMode('new')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                mode === 'new' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Record New
            </button>
            <button
              onClick={() => setMode('existing')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                mode === 'existing' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Link Existing
            </button>
          </div>

          {mode === 'new' ? (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600">
                This will automatically create a new Income transaction for <strong>${Number(loan.amount).toFixed(2)}</strong> with the category <strong>Payback</strong> in your <strong>{loan.accounts?.name || 'original'}</strong> account, dated today.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 mb-2">
                Select an existing unlinked Payback transaction to link to this loan.
              </p>
              
              {unlinkedPaybacks.length === 0 ? (
                <div className="p-4 bg-amber-50 rounded-xl text-sm text-amber-700 text-center">
                  No unlinked payback transactions found. Try recording a new one instead.
                </div>
              ) : (
                <select
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  value={selectedPaybackId}
                  onChange={(e) => setSelectedPaybackId(e.target.value)}
                >
                  <option value="" disabled>Select a payback transaction...</option>
                  {unlinkedPaybacks.map(pb => (
                    <option key={pb.id} value={pb.id}>
                      {format(new Date(pb.transaction_date), 'MMM dd')} - ${Number(pb.amount).toFixed(2)} - {pb.description || 'Payback'}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-100 flex justify-end space-x-2 shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {mode === 'new' ? (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCreateNew} disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Payback'}
            </Button>
          ) : (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white" 
              onClick={handleLinkExisting} 
              disabled={isSubmitting || !selectedPaybackId}
            >
              {isSubmitting ? 'Linking...' : 'Link Payback'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
