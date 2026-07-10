import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  ArrowLeftRight,
  BarChart3,
  AreaChart as AreaChartIcon
} from 'lucide-react';
import { TransactionGroup, Category } from '../../types';

interface AdvancedReportFilters {
  startDate: string;
  endDate: string;
  groupId: string;
  categoryId: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'annually';
}

interface AdvancedReportProps {
  groups: TransactionGroup[] | undefined;
  allCategories: Category[];
  filters: AdvancedReportFilters;
  onFilterChange: (filters: AdvancedReportFilters) => void;
  aggregatedData: any[];
  isLoading: boolean;
  kpis: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    totalTransfers: number;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-zinc-100 rounded-xl shadow-lg">
        <p className="text-xs font-semibold text-zinc-500 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-6 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-zinc-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </span>
              <span className="font-bold text-zinc-900">
                ${p.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function AdvancedReport({
  groups,
  allCategories,
  filters,
  onFilterChange,
  aggregatedData,
  isLoading,
  kpis
}: AdvancedReportProps) {
  const [chartStyle, setChartStyle] = useState<'bar' | 'area'>('bar');

  const updateFilter = (key: keyof AdvancedReportFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const timeframeOptions: { label: string; value: AdvancedReportFilters['timeframe'] }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Annually', value: 'annually' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income KPI */}
        <Card className="hover:shadow-md transition-all duration-300 border border-zinc-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Income</p>
                <p className="text-2xl font-bold text-zinc-900">
                  ${kpis.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses KPI */}
        <Card className="hover:shadow-md transition-all duration-300 border border-zinc-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Expenses</p>
                <p className="text-2xl font-bold text-zinc-900">
                  ${kpis.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Savings KPI */}
        <Card className="hover:shadow-md transition-all duration-300 border border-zinc-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Net Savings</p>
                <p className={`text-2xl font-bold ${kpis.netSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ${kpis.netSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`p-3 rounded-2xl ${kpis.netSavings >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <PiggyBank className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfers KPI */}
        <Card className="hover:shadow-md transition-all duration-300 border border-zinc-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Transfers</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${kpis.totalTransfers.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Chart Panel */}
      <Card className="border border-zinc-100 shadow-sm">
        <CardHeader className="border-b border-zinc-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-bold text-zinc-900">Advanced Transaction Report</CardTitle>
            
            {/* Chart Style Toggle */}
            <div className="flex items-center border border-zinc-200 rounded-xl p-0.5 self-start">
              <button
                onClick={() => setChartStyle('bar')}
                className={`p-2 rounded-lg transition-all ${
                  chartStyle === 'bar'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-900'
                }`}
                title="Bar Chart"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartStyle('area')}
                className={`p-2 rounded-lg transition-all ${
                  chartStyle === 'area'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-900'
                }`}
                title="Area Chart"
              >
                <AreaChartIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters controls */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Custom Segmented Control for Timeframe */}
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Timeframe</span>
                <div className="flex bg-zinc-100 p-0.5 rounded-xl border border-zinc-200 h-[38px] items-center overflow-x-auto scrollbar-none">
                  {timeframeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateFilter('timeframe', opt.value)}
                      className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all text-center whitespace-nowrap px-3 ${
                        filters.timeframe === opt.value
                          ? 'bg-white text-zinc-900 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Chart Display */}
          <div className="h-80 w-full pt-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-zinc-500">
                <span className="animate-pulse">Loading report data...</span>
              </div>
            ) : aggregatedData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartStyle === 'bar' ? (
                  <BarChart data={aggregatedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 11 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 11 }}
                    />
                    <Tooltip cursor={{ fill: '#fafafa' }} content={<CustomTooltip />} />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
                  </BarChart>
                ) : (
                  <AreaChart data={aggregatedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 11 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                      name="Income" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#f43f5e" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorExpense)" 
                      name="Expense" 
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                No data found for the selected filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
