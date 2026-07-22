import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Events from './Events';
import { useEvents, useCreateEvent, useDeleteEvent } from '../../hooks/useEvents';

jest.mock('../../hooks/useEvents');

const mockUseEvents = useEvents as jest.Mock;
const mockUseCreateEvent = useCreateEvent as jest.Mock;
const mockUseDeleteEvent = useDeleteEvent as jest.Mock;

describe('Events Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mocks
    mockUseEvents.mockReturnValue({ data: [], isLoading: false });
    mockUseCreateEvent.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseDeleteEvent.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders the page and empty state correctly', () => {
    renderWithRouter(<Events />);
    
    expect(screen.getByText('Event Budgets')).toBeInTheDocument();
    expect(screen.getByText('Create Event')).toBeInTheDocument();
    expect(screen.getByText('No events planned yet.')).toBeInTheDocument();
  });

  it('renders a list of events', () => {
    mockUseEvents.mockReturnValue({
      data: [
        { id: '1', name: 'Summer Vacation', start_date: '2023-06-01', end_date: '2023-06-15' },
        { id: '2', name: 'Wedding', start_date: '2024-09-10', end_date: '2024-09-12' }
      ],
      isLoading: false
    });

    renderWithRouter(<Events />);
    
    expect(screen.getByText('Summer Vacation')).toBeInTheDocument();
    expect(screen.getByText('Wedding')).toBeInTheDocument();
    // The empty state should not be visible
    expect(screen.queryByText('No events planned yet.')).not.toBeInTheDocument();
  });

  it('opens modal, fills form, and creates an event', async () => {
    const mutateMock = jest.fn((data, options) => {
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    });
    mockUseCreateEvent.mockReturnValue({ mutate: mutateMock, isPending: false });

    renderWithRouter(<Events />);
    
    const createBtn = screen.getByRole('button', { name: /Create Event/i });
    fireEvent.click(createBtn);

    expect(screen.getByText('Create New Event')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Event Name/i);
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);

    fireEvent.change(nameInput, { target: { value: 'New Test Event' } });
    fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-01-10' } });

    const submitBtns = screen.getAllByRole('button', { name: /Create Event/i });
    fireEvent.click(submitBtns[1]);

    expect(mutateMock).toHaveBeenCalledWith(
      { name: 'New Test Event', start_date: '2025-01-01', end_date: '2025-01-10' },
      expect.any(Object)
    );

    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByText('Create New Event')).not.toBeInTheDocument();
    });
  });

  it('deletes an event when confirmed', () => {
    window.confirm = jest.fn().mockReturnValue(true);
    const deleteMutateMock = jest.fn();
    mockUseDeleteEvent.mockReturnValue({ mutate: deleteMutateMock, isPending: false });

    mockUseEvents.mockReturnValue({
      data: [{ id: '1', name: 'Summer Vacation', start_date: '2023-06-01', end_date: '2023-06-15' }],
      isLoading: false
    });

    renderWithRouter(<Events />);

    // Since the delete button is just an icon, we can find it by looking for the closest button
    // The trash icon is usually inside a button that we can query.
    // In Events.tsx: <button onClick={(e) => handleDelete(event.id, e)} ...>
    // We can select it by role or we might need a generic click on the button.
    const buttons = screen.getAllByRole('button');
    // The "Create Event" is the first button usually, the delete button is the second.
    // Let's just find the trash icon button.
    // We can use a testid, but since we don't have one, we can look for the button inside the event card.
    const deleteBtn = buttons[1]; // Assuming it's the second button

    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this event? This will also remove its budget plan.'
    );
    expect(deleteMutateMock).toHaveBeenCalledWith('1');
  });
});
