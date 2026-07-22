// ============================================================================
// EDUCATIONAL GUIDE: TESTING USER INTERACTIONS & EVENTS
// ============================================================================
// In this test file, we verify the Transactions page.
// In addition to rendering checks, we also test user interactions (like clicking 
// tabs) using React Testing Library's "fireEvent" utilities.
// ============================================================================

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Transactions from './Transactions';
import { 
  useTransactions, 
  useAccounts, 
  useCategories, 
  useActiveGroups, 
  useCreateTransaction, 
  useCreateGroup, 
  useCreateCategory, 
  useDeleteTransaction, 
  useDeleteGroup, 
  useDeleteCategory, 
  useUpdateTransaction, 
  useUpdateGroup, 
  useUpdateCategory 
} from '../../hooks/useApi';
import { useEvents } from '../../hooks/useEvents';

// Mock our API hooks so that no real network queries are sent to Supabase.
jest.mock('../../hooks/useApi');
jest.mock('../../hooks/useEvents');

// Cast mocked hooks so Jest knows we can attach custom mock return values.
const mockUseTransactions = useTransactions as jest.Mock;
const mockUseEvents = useEvents as jest.Mock;
const mockUseAccounts = useAccounts as jest.Mock;
const mockUseCategories = useCategories as jest.Mock;
const mockUseActiveGroups = useActiveGroups as jest.Mock;
const mockUseCreateTransaction = useCreateTransaction as jest.Mock;
const mockUseCreateGroup = useCreateGroup as jest.Mock;
const mockUseCreateCategory = useCreateCategory as jest.Mock;
const mockUseDeleteTransaction = useDeleteTransaction as jest.Mock;
const mockUseDeleteGroup = useDeleteGroup as jest.Mock;
const mockUseDeleteCategory = useDeleteCategory as jest.Mock;
const mockUseUpdateTransaction = useUpdateTransaction as jest.Mock;
const mockUseUpdateGroup = useUpdateGroup as jest.Mock;
const mockUseUpdateCategory = useUpdateCategory as jest.Mock;

describe('Transactions Page', () => {
  beforeEach(() => {
    // Reset all mock states to ensure test isolation (clean slate before each run).
    jest.clearAllMocks();
    
    // Provide default empty database lists for transactions, accounts, and groups.
    mockUseTransactions.mockReturnValue({ data: [], isLoading: false });
    mockUseEvents.mockReturnValue({ data: [], isLoading: false });
    mockUseAccounts.mockReturnValue({ data: [{ id: '1', name: 'Bank' }] });
    mockUseCategories.mockReturnValue({ data: [{ id: '1', name: 'Food' }] });
    mockUseActiveGroups.mockReturnValue({ data: [{ id: '1', name: 'Trip' }] });
    
    // For mutations (create, edit, delete), we return dummy mutate functions.
    // "jest.fn()" creates a spy function that records when it gets called.
    mockUseCreateTransaction.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseCreateGroup.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseCreateCategory.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseDeleteTransaction.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseDeleteGroup.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseDeleteCategory.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseUpdateTransaction.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseUpdateGroup.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseUpdateCategory.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  // --------------------------------------------------------------------------
  // TEST CASE 1: Basic Page Rendering
  // --------------------------------------------------------------------------
  it('renders the page correctly', () => {
    render(<Transactions />);
    
    // Assert that the page title, form header, and manager cards are rendered.
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
    expect(screen.getByText('Create Category')).toBeInTheDocument();
    expect(screen.getByText('Create Group')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // TEST CASE 2: Testing User Clicks & Interactive Events (fireEvent)
  // --------------------------------------------------------------------------
  // Here, we simulate a user clicking tabs to switch between Income and Expense.
  // We assert that clicking these buttons correctly toggles the helper labels.
  // --------------------------------------------------------------------------
  it('switches between income and expense', () => {
    render(<Transactions />);
    
    // Locate the "Income" and "Expense" buttons on the screen.
    const incomeBtn = screen.getByText('Income', { selector: 'button' });
    const expenseBtn = screen.getByText('Expense', { selector: 'button' });

    // 1. Simulate clicking the "Income" button
    fireEvent.click(incomeBtn);
    // Verify that the UI updates to show the income helper message
    expect(screen.getByText('Creates a new income category')).toBeInTheDocument();

    // 2. Simulate clicking the "Expense" button
    fireEvent.click(expenseBtn);
    // Verify that the UI updates to show the expense helper message
    expect(screen.getByText('Creates a new expense category')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // TEST CASE 3: Testing Form Submission for creating a transaction
  // --------------------------------------------------------------------------
  it('fills form and creates a new transaction', async () => {
    const mutateMock = jest.fn();
    mockUseCreateTransaction.mockReturnValue({ mutate: mutateMock, isPending: false });

    // Ensure we have some default categories/accounts
    mockUseAccounts.mockReturnValue({ data: [{ id: 'acc1', name: 'Main Account' }] });
    mockUseCategories.mockReturnValue({ data: [{ id: 'cat1', name: 'Food' }] });

    render(<Transactions />);

    // Fill amount
    const amountInput = screen.getByLabelText(/Amount/i);
    fireEvent.change(amountInput, { target: { value: '50' } });

    // Select account
    const accountSelect = screen.getByLabelText(/Account/i);
    fireEvent.change(accountSelect, { target: { value: 'acc1' } });

    // Select category
    const categorySelect = screen.getByLabelText(/Category/i);
    fireEvent.change(categorySelect, { target: { value: 'cat1' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Save Transaction/i });
    fireEvent.click(submitBtn);

    // Verify API call was made
    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50,
          account_id: 'acc1',
          category_id: 'cat1',
          type: 'expense'
        })
      );
    });
  });
});
