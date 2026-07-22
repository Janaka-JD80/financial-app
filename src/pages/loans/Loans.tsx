import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { getTransactions } from '../../api/transactions';
import { Transaction } from '../../types';
import { parseLoanPaybackDescription } from '../../lib/utils';
import { format } from 'date-fns';
import { HandCoins, Info, CheckCircle2, Circle } from 'lucide-react';
import { MarkLoanPaidModal } from '../../components/loans/MarkLoanPaidModal';
import { Button } from '../../components/ui/Button';
import { unlinkLoanPayback } from '../../api/transactions';

export default function Loans() {
  const [selectedLoan, setSelectedLoan] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions()
  });

  const { loans, allPaybacks, totalLoans, totalPaybacks } = useMemo(() => {
    if (!transactions) return { loans: [], allPaybacks: [], totalLoans: 0, totalPaybacks: 0 };

    const loansList: Transaction[] = [];
    const paybacksList: Transaction[] = [];
    let tLoans = 0;
    let tPaybacks = 0;

    transactions.forEach(tx => {
      const catName = tx.categories?.name?.toLowerCase();
      if (catName === 'loan' && tx.type === 'expense') {
        loansList.push(tx);
        tLoans += Number(tx.amount);
      }
      if (catName === 'payback' && tx.type === 'income') {
        paybacksList.push(tx);
        tPaybacks += Number(tx.amount);
      }
    });

    return { loans: loansList, allPaybacks: paybacksList, totalLoans: tLoans, totalPaybacks: tPaybacks };
  }, [transactions]);

  const outstanding = Math.max(0, totalLoans - totalPaybacks);

  const getLoanStatus = (loan: Transaction) => {
    const payback = allPaybacks.find(pb => {
      const info = parseLoanPaybackDescription(pb.description);
      return info && info.loanId === loan.id;
    });
    return payback;
  };

  const handleUnmarkPaid = async (payback: Transaction) => {
    if (!confirm('Are you sure you want to unlink this payback?')) return;
    try {
      await unlinkLoanPayback(payback.id, payback.description || '');
      refetch();
    } catch (e) {
      console.error(e);
      alert('Failed to unlink');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Loading loans...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Loans</h1>
          <p className="text-zinc-500 text-sm mt-1">Track money you have lent out and paybacks received.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 text-white border-zinc-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 font-medium mb-1">Total Loans Given</p>
                <h3 className="text-3xl font-bold">${totalLoans.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <HandCoins className="w-5 h-5 text-zinc-300" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-700 font-medium mb-1">Total Paybacks</p>
                <h3 className="text-3xl font-bold text-emerald-900">${totalPaybacks.toFixed(2)}</h3>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <Info className="w-3 h-3 mr-1" /> Includes all unlinked past paybacks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-500 font-medium mb-1">Net Outstanding</p>
                <h3 className="text-3xl font-bold text-zinc-900">${outstanding.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issued Loans</CardTitle>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <p className="text-zinc-500 text-sm py-4 text-center">No loans found. Create an expense with category "Loan" to see it here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-zinc-500">
                <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 rounded-xl">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map(loan => {
                    const paybackTx = getLoanStatus(loan);
                    const isPaid = !!paybackTx;

                    return (
                      <tr key={loan.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-600">
                              <Circle className="w-3.5 h-3.5" /> Unpaid
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">{format(new Date(loan.transaction_date), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-4 font-medium text-zinc-900">{loan.description || 'Loan'}</td>
                        <td className="px-4 py-4 text-zinc-600">{loan.accounts?.name || '-'}</td>
                        <td className="px-4 py-4 text-right font-semibold text-zinc-900">
                          ${Number(loan.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          {isPaid ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-zinc-400 hover:text-red-600 h-8"
                              onClick={() => handleUnmarkPaid(paybackTx)}
                            >
                              Unmark
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                              onClick={() => {
                                setSelectedLoan(loan);
                                setIsModalOpen(true);
                              }}
                            >
                              Mark as Paid
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {isModalOpen && selectedLoan && (
        <MarkLoanPaidModal
          loan={selectedLoan}
          allPaybacks={allPaybacks}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLoan(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedLoan(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
