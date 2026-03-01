import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useAccounts, useTransactions } from '../hooks/useApi';

jest.mock('../hooks/useApi');

const mockUseAccounts = useAccounts as jest.Mock;
const mockUseTransactions = useTransactions as jest.Mock;

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockUseAccounts.mockReturnValue({ data: undefined, isLoading: true });
    mockUseTransactions.mockReturnValue({ data: undefined, isLoading: true });
    
    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders dashboard with data', () => {
    mockUseAccounts.mockReturnValue({
      data: [
        { id: '1', name: 'Main Bank', type: 'bank', balance: 1000 },
        { id: '2', name: 'Cash', type: 'cash', balance: 200 },
      ],
      isLoading: false,
    });

    mockUseTransactions.mockReturnValue({
      data: [
        {
          id: '1',
          type: 'income',
          amount: 500,
          transaction_date: '2023-10-01',
          description: 'Salary',
          accounts: { name: 'Main Bank' },
          categories: { name: 'Work' }
        }
      ],
      isLoading: false,
    });

    render(<Dashboard />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('$1200.00')).toBeInTheDocument(); // Total balance
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Main Bank')).toBeInTheDocument();
  });
});
