import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Transactions from './Transactions';
import { useTransactions, useAccounts, useCategories, useActiveGroups, useCreateTransaction, useCreateGroup, useCreateCategory } from '../hooks/useApi';

jest.mock('../hooks/useApi');

const mockUseTransactions = useTransactions as jest.Mock;
const mockUseAccounts = useAccounts as jest.Mock;
const mockUseCategories = useCategories as jest.Mock;
const mockUseActiveGroups = useActiveGroups as jest.Mock;
const mockUseCreateTransaction = useCreateTransaction as jest.Mock;
const mockUseCreateGroup = useCreateGroup as jest.Mock;
const mockUseCreateCategory = useCreateCategory as jest.Mock;

describe('Transactions Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseTransactions.mockReturnValue({ data: [], isLoading: false });
    mockUseAccounts.mockReturnValue({ data: [{ id: '1', name: 'Bank' }] });
    mockUseCategories.mockReturnValue({ data: [{ id: '1', name: 'Food' }] });
    mockUseActiveGroups.mockReturnValue({ data: [{ id: '1', name: 'Trip' }] });
    
    mockUseCreateTransaction.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseCreateGroup.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseCreateCategory.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it('renders the page correctly', () => {
    render(<Transactions />);
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
    expect(screen.getByText('Create Category')).toBeInTheDocument();
    expect(screen.getByText('Create Group')).toBeInTheDocument();
  });

  it('switches between income and expense', () => {
    render(<Transactions />);
    
    const incomeBtn = screen.getByText('Income', { selector: 'button' });
    const expenseBtn = screen.getByText('Expense', { selector: 'button' });

    fireEvent.click(incomeBtn);
    expect(screen.getByText('Creates a new income category')).toBeInTheDocument();

    fireEvent.click(expenseBtn);
    expect(screen.getByText('Creates a new expense category')).toBeInTheDocument();
  });
});
