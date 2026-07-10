import { useState, useMemo } from 'react';
import { useActiveGroups, useGroupSummary, useTransactionReport, useCategories } from '../../hooks/useApi';
import { AdvancedReport } from '../../components/reports/AdvancedReport';
import { CategoryPieCharts } from '../../components/reports/CategoryPieCharts';
import { CategoryBreakdownList } from '../../components/reports/CategoryBreakdownList';
import { GroupSummaryCard } from '../../components/reports/GroupSummaryCard';
import { aggregateReportData } from '../../api';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { isTransferTransaction } from '../../lib/utils';

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
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    groupId: '',
    categoryId: '',
    timeframe: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'annually'
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

  // Compute reports page KPI metrics
  const kpis = useMemo(() => {
    let income = 0;
    let expense = 0;
    let transfers = 0;

    if (reportTransactions) {
      reportTransactions.forEach(tx => {
        const isTxTransfer = isTransferTransaction(tx);
        const amt = Number(tx.amount);
        
        if (isTxTransfer) {
          // A transfer contains an expense row and an income row, 
          // we sum only one side (expense) to represent the net value transferred.
          if (tx.type === 'expense') {
            transfers += amt;
          }
        } else {
          if (tx.type === 'income') {
            income += amt;
          } else if (tx.type === 'expense') {
            expense += amt;
          }
        }
      });
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      netSavings: income - expense,
      totalTransfers: transfers,
    };
  }, [reportTransactions]);

  const categoryBreakdown = useMemo(() => {
    if (!reportTransactions) return { income: [], expense: [] };

    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    reportTransactions.forEach(tx => {
      // Exclude transfers from standard category breakdown
      if (isTransferTransaction(tx)) return;

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Reports</h1>
      </div>

      <AdvancedReport
        groups={groups}
        allCategories={allCategories}
        filters={reportFilters}
        onFilterChange={setReportFilters}
        aggregatedData={aggregatedData}
        isLoading={isReportLoading}
        kpis={kpis}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <CategoryPieCharts categoryBreakdown={categoryBreakdown} />
        </div>
        <div className="lg:col-span-1">
          <CategoryBreakdownList categoryBreakdown={categoryBreakdown} />
        </div>
      </div>

      <GroupSummaryCard
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        groupSummary={groupSummary}
      />
    </div>
  );
}
