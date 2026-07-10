import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Select } from '../ui/Input';
import { TransactionGroup, GroupSummary } from '../../types';
import { TrendingUp, TrendingDown, Wallet, FolderClosed } from 'lucide-react';

interface GroupSummaryCardProps {
  groups: TransactionGroup[] | undefined;
  selectedGroup: string;
  onGroupChange: (id: string) => void;
  groupSummary: GroupSummary | undefined;
}

export function GroupSummaryCard({
  groups,
  selectedGroup,
  onGroupChange,
  groupSummary,
}: GroupSummaryCardProps) {
  
  // Calculate expense ratio if we have income and expense
  const expenseRatio = groupSummary && groupSummary.totalIncome > 0
    ? (groupSummary.totalExpense / groupSummary.totalIncome) * 100
    : 0;

  return (
    <Card className="border border-zinc-100 shadow-sm">
      <CardHeader className="border-b border-zinc-100 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-bold text-zinc-900">Group Summary</CardTitle>
          <div className="w-full sm:w-64">
            <Select
              label=""
              value={selectedGroup}
              onChange={(e) => onGroupChange(e.target.value)}
              options={[{ label: 'Select a group...', value: '' }, ...(groups?.map(g => ({ label: g.name, value: g.id })) || [])]}
              className="w-full"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {selectedGroup && groupSummary ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Income */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Income</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    ${groupSummary.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {/* Total Expense */}
              <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Total Expense</p>
                  <p className="text-2xl font-bold text-rose-700">
                    ${groupSummary.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>

              {/* Net Cash Flow */}
              <div className={`p-4 border rounded-2xl flex items-center justify-between ${
                groupSummary.net >= 0 
                  ? 'bg-indigo-50/50 border-indigo-100 text-indigo-700' 
                  : 'bg-amber-50/50 border-amber-100 text-amber-700'
              }`}>
                <div className="space-y-1">
                  <p className={`text-xs font-semibold uppercase tracking-wider ${
                    groupSummary.net >= 0 ? 'text-indigo-600' : 'text-amber-600'
                  }`}>
                    Net Group Savings
                  </p>
                  <p className={`text-2xl font-bold ${
                    groupSummary.net >= 0 ? 'text-indigo-700' : 'text-amber-700'
                  }`}>
                    ${groupSummary.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${
                  groupSummary.net >= 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Visual Progress Bar (Expense vs Income Ratio) */}
            {groupSummary.totalIncome > 0 && (
              <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-zinc-700">Group Budget Utilization</span>
                  <span className={`font-bold ${expenseRatio > 100 ? 'text-rose-600' : 'text-zinc-600'}`}>
                    {expenseRatio.toFixed(1)}% of income spent
                  </span>
                </div>
                <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      expenseRatio > 90 
                        ? 'bg-rose-500' 
                        : expenseRatio > 70 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(expenseRatio, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  {expenseRatio > 100 
                    ? '⚠️ Expenses exceed total group income. Consider re-evaluating spend.' 
                    : 'Good standing. Group expenses are fully funded by group income.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-zinc-400 gap-3 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
            <FolderClosed className="w-8 h-8 text-zinc-300" />
            <p className="text-sm font-medium">Select a transaction group from the menu to load details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
