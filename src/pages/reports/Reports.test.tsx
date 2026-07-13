// ============================================================================
// EDUCATIONAL GUIDE: HOW UNIT TESTING WORKS HERE
// ============================================================================
// We use two primary libraries for testing our React application:
// 1. Jest: The test runner that manages files, runs tests, and provides "mocking" tools.
// 2. React Testing Library (RTL): Renders components in a virtual browser so we can check their text/behavior.
// ============================================================================

import { render, screen } from '@testing-library/react';
import Reports from './Reports';
import { 
  useTransactions, 
  useActiveGroups, 
  useGroupSummary, 
  useTransactionReport, 
  useCategories 
} from '../../hooks/useApi';

// ----------------------------------------------------------------------------
// 1. MOCKING API CALLS (jest.mock)
// ----------------------------------------------------------------------------
// When running tests, we do NOT want to connect to your real live Supabase database.
// Real API calls would make tests slow, fragile, and dependent on an internet connection.
// Instead, "jest.mock" intercepts imports from '../../hooks/useApi' and replaces them 
// with dummy functions we can control.
// ----------------------------------------------------------------------------
jest.mock('../../hooks/useApi');

// ----------------------------------------------------------------------------
// 2. MOCKING EXTERNAL COMPONENTS (Recharts)
// ----------------------------------------------------------------------------
// Recharts is a complex visual library that draws SVG charts on screen.
// Drawing complex graphics in a virtual test environment is slow and unnecessary.
// So, we replace the charts (ResponsiveContainer, BarChart, PieChart) with simple
// dummy <div> tags containing "data-testid" labels. This allows our tests to say:
// "Ensure the bar chart element exists on the page" without rendering real visuals.
// ----------------------------------------------------------------------------
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: () => <div data-testid="bar-chart" />,
    PieChart: () => <div data-testid="pie-chart" />,
  };
});

// Casting our mocked hook functions into Jest Mock types so TypeScript knows 
// we can call mock-specific functions on them (like `.mockReturnValue`).
const mockUseTransactions = useTransactions as jest.Mock;
const mockUseActiveGroups = useActiveGroups as jest.Mock;
const mockUseGroupSummary = useGroupSummary as jest.Mock;
const mockUseTransactionReport = useTransactionReport as jest.Mock;
const mockUseCategories = useCategories as jest.Mock;

describe('Reports Page', () => {
  // --------------------------------------------------------------------------
  // 3. SETTING UP DUMMY DATA (beforeEach)
  // --------------------------------------------------------------------------
  // Before EVERY single test run, we clear previous mock statuses and define what
  // each hook will return when the component renders.
  // This simulates having transactions and groups in our database.
  // --------------------------------------------------------------------------
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Simulate finding one active transaction in global scope
    mockUseTransactions.mockReturnValue({
      data: [{ id: '1', type: 'income', amount: 1000, transaction_date: '2023-10-01' }]
    });
    // Simulate having a transaction group named "Trip"
    mockUseActiveGroups.mockReturnValue({
      data: [{ id: '1', name: 'Trip' }]
    });
    // Simulate the group financial summary numbers
    mockUseGroupSummary.mockReturnValue({
      data: { totalIncome: 1000, totalExpense: 200, net: 800 }
    });
    // Simulate the query data returned for reports filters
    mockUseTransactionReport.mockReturnValue({
      data: [
        { id: '1', type: 'income', amount: 1000, transaction_date: '2023-10-01', categories: { name: 'Salary' } },
        { id: '2', type: 'expense', amount: 200, transaction_date: '2023-10-02', categories: { name: 'Food' } }
      ],
      isLoading: false
    });
    // Simulate categories loaded
    mockUseCategories.mockReturnValue({
      data: [{ id: '1', name: 'Food' }]
    });
  });

  // --------------------------------------------------------------------------
  // 4. TEST CASE assertion (it/expect)
  // --------------------------------------------------------------------------
  // This is the actual test assertion. We render the component virtualized,
  // and assert that specific texts, cards, and test-ids exist in the DOM.
  // --------------------------------------------------------------------------
  it('renders reports page', () => {
    // Render the <Reports /> page inside our virtual browser
    render(<Reports />);
    
    // Expect specific text components to be visible
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Advanced Transaction Report')).toBeInTheDocument();
    
    // Expect our mocked BarChart element to exist
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    
    // Expect specific breakdown labels to be visible
    expect(screen.getByText('Income by Category')).toBeInTheDocument();
    expect(screen.getByText('Expense by Category')).toBeInTheDocument();
    
    // Expect 2 Pie Charts to be rendered (one for income, one for expense)
    expect(screen.getAllByTestId('pie-chart')).toHaveLength(2);
    
    // Expect the Group Summary card header to be displayed
    expect(screen.getByText('Group Summary')).toBeInTheDocument();
  });
});
