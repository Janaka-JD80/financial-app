import { render, screen } from '@testing-library/react';
import Reports from './Reports';
import { useTransactions, useActiveGroups, useGroupSummary, useTransactionReport, useCategories } from '../hooks/useApi';

jest.mock('../hooks/useApi');
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: () => <div data-testid="bar-chart" />,
    PieChart: () => <div data-testid="pie-chart" />,
  };
});

const mockUseTransactions = useTransactions as jest.Mock;
const mockUseActiveGroups = useActiveGroups as jest.Mock;
const mockUseGroupSummary = useGroupSummary as jest.Mock;
const mockUseTransactionReport = useTransactionReport as jest.Mock;
const mockUseCategories = useCategories as jest.Mock;

describe('Reports Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseTransactions.mockReturnValue({
      data: [{ id: '1', type: 'income', amount: 1000, transaction_date: '2023-10-01' }]
    });
    mockUseActiveGroups.mockReturnValue({
      data: [{ id: '1', name: 'Trip' }]
    });
    mockUseGroupSummary.mockReturnValue({
      data: { totalIncome: 1000, totalExpense: 200, net: 800 }
    });
    mockUseTransactionReport.mockReturnValue({
      data: [
        { id: '1', type: 'income', amount: 1000, transaction_date: '2023-10-01', categories: { name: 'Salary' } },
        { id: '2', type: 'expense', amount: 200, transaction_date: '2023-10-02', categories: { name: 'Food' } }
      ],
      isLoading: false
    });
    mockUseCategories.mockReturnValue({
      data: [{ id: '1', name: 'Food' }]
    });
  });

  it('renders reports page', () => {
    render(<Reports />);
    
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Advanced Transaction Report')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByText('Income by Category')).toBeInTheDocument();
    expect(screen.getByText('Expense by Category')).toBeInTheDocument();
    expect(screen.getAllByTestId('pie-chart')).toHaveLength(2);
    expect(screen.getByText('Group Summary')).toBeInTheDocument();
  });
});
