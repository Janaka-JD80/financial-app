import { render, screen } from '@testing-library/react';
import AssetsLiabilities from './AssetsLiabilities';
import { useAssets, useCreateAsset, useUpdateAsset, useLiabilities, useCreateLiability, useUpdateLiability } from '../hooks/useApi';

jest.mock('../hooks/useApi');

const mockUseAssets = useAssets as jest.Mock;
const mockUseCreateAsset = useCreateAsset as jest.Mock;
const mockUseUpdateAsset = useUpdateAsset as jest.Mock;
const mockUseLiabilities = useLiabilities as jest.Mock;
const mockUseCreateLiability = useCreateLiability as jest.Mock;
const mockUseUpdateLiability = useUpdateLiability as jest.Mock;

describe('Assets & Liabilities Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAssets.mockReturnValue({
      data: [{ id: '1', name: 'Car', purchase_value: 20000, monthly_decay: 200, purchase_date: '2023-01-01' }]
    });
    mockUseCreateAsset.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseUpdateAsset.mockReturnValue({ mutate: jest.fn(), isPending: false });
    
    mockUseLiabilities.mockReturnValue({
      data: [{ id: '1', name: 'Loan', total_amount: 5000, remaining_amount: 4000, end_date: '2025-01-01' }]
    });
    mockUseCreateLiability.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseUpdateLiability.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it('renders assets and liabilities', () => {
    render(<AssetsLiabilities />);
    
    expect(screen.getByText('Assets & Liabilities')).toBeInTheDocument();
    expect(screen.getByText('Car')).toBeInTheDocument();
    expect(screen.getByText('Original: $20000.00')).toBeInTheDocument();
    
    expect(screen.getByText('Loan')).toBeInTheDocument();
    expect(screen.getByText('Total: $5000.00')).toBeInTheDocument();
  });
});
