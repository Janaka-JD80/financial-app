// ============================================================================
// EDUCATIONAL GUIDE: TESTING USER INTERACTIONS & EVENTS
// ============================================================================
// In this test file, we verify the Transactions page.
// In addition to rendering checks, we also test user interactions (like clicking 
// tabs) using React Testing Library's "fireEvent" utilities.
// ============================================================================

import { render, screen, fireEvent } from '@testing-library/react';
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
});
