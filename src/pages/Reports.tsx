import { useState, useMemo } from 'react';
import { useTransactions, useActiveGroups, useGroupSummary, useTransactionReport, useCategories } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { aggregateReportData } from '../api';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

export default function Reports() {
  const { data: groups } = useActiveGroups();
  const { data: incomeCategories } = useCategories('income');
  const { data: expenseCategories } = useCategories('expense');
  
  const allCategories = useMemo(() => {
    return [...(incomeCategories || []), ...(expenseCategories || [])];
  }, [incomeCategories, expenseCategories]);

  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const { data: groupSummary } = useGroupSummary(selectedGroup);

  // Advanced Report State
  const [reportFilters, setReportFilters] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 5)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    groupId: '',
    categoryId: '',
    timeframe: 'monthly' as 'daily' | 'monthly' | 'annually'
  });

  const { data: reportTransactions, isLoading: isReportLoading } = useTransactionReport({
    startDate: reportFilters.startDate,
    endDate: reportFilters.endDate,
    groupId: reportFilters.groupId || undefined,
    categoryId: reportFilters.categoryId || undefined,
  });

  const aggregatedData = useMemo(() => {
    if (!reportTransactions) return [];
    return aggregateReportData(reportTransactions, reportFilters.timeframe);
  }, [reportTransactions, reportFilters.timeframe]);

  const categoryBreakdown = useMemo(() => {
    if (!reportTransactions) return { income: [], expense: [] };

    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    reportTransactions.forEach(tx => {
      const categoryName = tx.categories?.name || 'Uncategorized';
      const amount = Number(tx.amount);

      if (tx.type === 'income') {
        incomeMap.set(categoryName, (incomeMap.get(categoryName) || 0) + amount);
      } else if (tx.type === 'expense') {
        expenseMap.set(categoryName, (expenseMap.get(categoryName) || 0) + amount);
      }
    });

    const formatData = (map: Map<string, number>) => 
      Array.from(map.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    return {
      income: formatData(incomeMap),
      expense: formatData(expenseMap)
    };
  }, [reportTransactions]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Transaction Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Input 
              label="Start Date" 
              type="date" 
              value={reportFilters.startDate}
              onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <Input 
              label="End Date" 
              type="date" 
              value={reportFilters.endDate}
              onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
            <Select
              label="Timeframe"
              value={reportFilters.timeframe}
              onChange={(e) => setReportFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
              options={[
                { label: 'Daily', value: 'daily' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Annually', value: 'annually' },
              ]}
            />
            <Select
              label="Filter by Group"
              value={reportFilters.groupId}
              onChange={(e) => setReportFilters(prev => ({ ...prev, groupId: e.target.value }))}
              options={[{ label: 'All Groups', value: '' }, ...(groups?.map(g => ({ label: g.name, value: g.id })) || [])]}
            />
            <Select
              label="Filter by Category"
              value={reportFilters.categoryId}
              onChange={(e) => setReportFilters(prev => ({ ...prev, categoryId: e.target.value }))}
              options={[{ label: 'All Categories', value: '' }, ...(allCategories?.map(c => ({ label: c.name, value: c.id })) || [])]}
            />
          </div>

          <div className="h-80 w-full">
            {isReportLoading ? (
              <div className="h-full flex items-center justify-center text-zinc-500">Loading report data...</div>
            ) : aggregatedData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f4f4f5' }} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">No data found for the selected filters.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {categoryBreakdown.income.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown.income}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryBreakdown.income.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">No income data</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {categoryBreakdown.expense.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown.expense}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryBreakdown.expense.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">No expense data</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
