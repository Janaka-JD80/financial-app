import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Select } from '../ui/Input';
import { TransactionGroup, GroupSummary } from '../../types';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-md mb-6">
          <Select
            label="Select Group"
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value)}
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
          <p className="text-zinc-500 text-sm">Select a group to view its summary.</p>
        )}
      </CardContent>
    </Card>
  );
}
