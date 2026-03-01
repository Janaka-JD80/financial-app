import { render, screen } from '@testing-library/react';
import Accounts from './Accounts';
import { useAccounts, useCreateAccount, useFunds, useCreateFund } from '../hooks/useApi';

jest.mock('../hooks/useApi');

const mockUseAccounts = useAccounts as jest.Mock;
const mockUseCreateAccount = useCreateAccount as jest.Mock;
const mockUseFunds = useFunds as jest.Mock;
const mockUseCreateFund = useCreateFund as jest.Mock;

describe('Accounts Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAccounts.mockReturnValue({ data: [{ id: '1', name: 'My Bank', type: 'bank', balance: 1000 }] });
    mockUseCreateAccount.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseFunds.mockReturnValue({ data: [{ id: '1', name: 'Emergency', target_amount: 5000, current_balance: 1000 }] });
    mockUseCreateFund.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it('renders accounts and funds', () => {
    render(<Accounts />);
    
    expect(screen.getByText('Accounts & Funds')).toBeInTheDocument();
    expect(screen.getByText('My Bank')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    
    expect(screen.getByText('Emergency')).toBeInTheDocument();
    expect(screen.getByText('$1000.00 / $5000.00')).toBeInTheDocument();
  });
});
