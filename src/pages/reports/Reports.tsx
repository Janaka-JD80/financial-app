import { useState, useMemo } from 'react';
import { useActiveGroups, useGroupSummary, useTransactionReport, useCategories } from '../../hooks/useApi';
import { AdvancedReport } from '../../components/reports/AdvancedReport';
import { CategoryPieCharts } from '../../components/reports/CategoryPieCharts';
import { GroupSummaryCard } from '../../components/reports/GroupSummaryCard';
import { aggregateReportData } from '../../api';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export default function Reports() {
  const { data: groups } = useActiveGroups();
  const { data: incomeCategories } = useCategories('income');
  const { data: expenseCategories } = useCategories('expense');
  
  const allCategories = useMemo(() => {
    return [...(incomeCategories || []), ...(expenseCategories || [])];
  }, [incomeCategories, expenseCategories]);

  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const { data: groupSummary } = useGroupSummary(selectedGroup);

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
      <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Reports</h1>

      <AdvancedReport
        groups={groups}
        allCategories={allCategories}
        filters={reportFilters}
        onFilterChange={setReportFilters}
        aggregatedData={aggregatedData}
        isLoading={isReportLoading}
      />

      <CategoryPieCharts categoryBreakdown={categoryBreakdown} />

      <GroupSummaryCard
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        groupSummary={groupSummary}
      />
    </div>
  );
}
