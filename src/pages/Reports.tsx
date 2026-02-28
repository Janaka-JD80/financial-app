import { useState } from 'react';
import { useTransactions, useActiveGroups, useGroupSummary } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function Reports() {
  const { data: transactions } = useTransactions();
  const { data: groups } = useActiveGroups();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  
  const { data: groupSummary } = useGroupSummary(selectedGroup);

  // Process data for monthly chart
  const monthlyData = transactions?.reduce((acc: any[], tx) => {
    const month = format(parseISO(tx.transaction_date), 'MMM yyyy');
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      if (tx.type === 'income') existing.income += Number(tx.amount);
      else existing.expense += Number(tx.amount);
    } else {
      acc.push({
        month,
        income: tx.type === 'income' ? Number(tx.amount) : 0,
        expense: tx.type === 'expense' ? Number(tx.amount) : 0,
      });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expense (Monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.reverse()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f4f4f5' }} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mb-6">
            <Select
              label="Select Group"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              options={groups?.map(g => ({ label: g.name, value: g.id })) || []}
            />
          </div>

          {selectedGroup && groupSummary ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl">
                <p className="text-sm text-emerald-600 font-medium">Total Income</p>
                <p className="text-2xl font-bold text-emerald-700">${groupSummary.totalIncome.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl">
                <p className="text-sm text-red-600 font-medium">Total Expense</p>
                <p className="text-2xl font-bold text-red-700">${groupSummary.totalExpense.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl">
                <p className="text-sm text-zinc-600 font-medium">Net</p>
                <p className={`text-2xl font-bold ${groupSummary.net >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  ${groupSummary.net.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-zinc-500">Select a group to view its summary.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
