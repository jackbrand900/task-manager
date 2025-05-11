import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    mockOnCreate.mockClear();
  });

  it('renders input fields and submit button', () => {
    render(<TaskForm onCreate={mockOnCreate} />);

    expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('calls onCreate with correct data when form is submitted', async () => {
    render(<TaskForm onCreate={mockOnCreate} />);

    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: 'Test Title' },
    });

    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith('Test Title', 'Test Description');
    });
  });

  it('clears the input fields after submission', async () => {
    render(<TaskForm onCreate={mockOnCreate} />);

    const titleInput = screen.getByPlaceholderText(/task title/i);
    const descInput = screen.getByPlaceholderText(/description/i);

    fireEvent.change(titleInput, { target: { value: 'Task A' } });
    fireEvent.change(descInput, { target: { value: 'Details' } });

    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(titleInput.value).toBe('');
    });
    await waitFor(() => {
      expect(descInput.value).toBe('');
    });
  });

  it('does not call onCreate if title is empty or whitespace', () => {
    render(<TaskForm onCreate={mockOnCreate} />);

    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: '   ' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    expect(mockOnCreate).not.toHaveBeenCalled();
  });
});
