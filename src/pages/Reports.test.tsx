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
      data: [{ id: '1', type: 'income', amount: 1000, transaction_date: '2023-10-01' }],
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
    expect(screen.getByText('Group Summary')).toBeInTheDocument();
  });
});
