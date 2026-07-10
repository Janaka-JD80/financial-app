import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useState } from 'react';

const BAR_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-indigo-500',
];

interface BreakdownItem {
  name: string;
  value: number;
}

interface CategoryBreakdownListProps {
  categoryBreakdown: {
    income: BreakdownItem[];
    expense: BreakdownItem[];
  };
}

export function CategoryBreakdownList({ categoryBreakdown }: CategoryBreakdownListProps) {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  
  const items = activeTab === 'expense' ? categoryBreakdown.expense : categoryBreakdown.income;
  const total = items.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold">Category Breakdown</CardTitle>
        <div className="flex bg-zinc-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'expense'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-950'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'income'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-950'
            }`}
          >
            Income
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">
            No {activeTab} data found
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {items.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const barColor = BAR_COLORS[index % BAR_COLORS.length];
              
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-700">{item.name}</span>
                    <span className="text-zinc-500 font-semibold">
                      ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-xs font-normal text-zinc-400 ml-1.5">({percentage.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
