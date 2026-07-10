import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TransactionGroup, Category } from '../../types';

interface AdvancedReportFilters {
  startDate: string;
  endDate: string;
  groupId: string;
  categoryId: string;
  timeframe: 'daily' | 'monthly' | 'annually';
}

interface AdvancedReportProps {
  groups: TransactionGroup[] | undefined;
  allCategories: Category[];
  filters: AdvancedReportFilters;
  onFilterChange: (filters: AdvancedReportFilters) => void;
  aggregatedData: any[];
  isLoading: boolean;
}

export function AdvancedReport({
  groups,
  allCategories,
  filters,
  onFilterChange,
  aggregatedData,
  isLoading,
}: AdvancedReportProps) {
  const updateFilter = (key: keyof AdvancedReportFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Transaction Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Input 
            label="Start Date" 
            type="date" 
            value={filters.startDate}
            onChange={(e) => updateFilter('startDate', e.target.value)}
          />
          <Input 
            label="End Date" 
            type="date" 
            value={filters.endDate}
            onChange={(e) => updateFilter('endDate', e.target.value)}
          />
          <Select
            label="Timeframe"
            value={filters.timeframe}
            onChange={(e) => updateFilter('timeframe', e.target.value as any)}
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Annually', value: 'annually' },
            ]}
          />
          <Select
            label="Filter by Group"
            value={filters.groupId}
            onChange={(e) => updateFilter('groupId', e.target.value)}
            options={[{ label: 'All Groups', value: '' }, ...(groups?.map(g => ({ label: g.name, value: g.id })) || [])]}
          />
          <Select
            label="Filter by Category"
            value={filters.categoryId}
            onChange={(e) => updateFilter('categoryId', e.target.value)}
            options={[{ label: 'All Categories', value: '' }, ...(allCategories?.map(c => ({ label: c.name, value: c.id })) || [])]}
          />
        </div>

        <div className="h-80 w-full">
          {isLoading ? (
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
  );
}
