// Tests were generated with assistance of Claude
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskManager from './TaskManager';

// Mock fetch globally
global.fetch = jest.fn();

const mockTasks = [
  {
    id: '1',
    title: 'Test Task',
    description: 'Testing...',
    status: 'Pending',
    createdAt: Date.now(),
    duration: 30000,
  },
];

describe('TaskManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    fetch.mockImplementation((url, options) => {
      if (url.endsWith('/tasks') && (!options || options.method === 'GET')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockTasks),
        });
      }

      if (url.endsWith('/tasks') && options.method === 'POST') {
        return Promise.resolve({ ok: true });
      }

      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  it('renders the title and form', async () => {
    render(<TaskManager />);
    expect(await screen.findByText(/task manager/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
  });

  it('fetches and displays tasks from the API', async () => {
    render(<TaskManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });

  it('creates a new task via form submission', async () => {
    render(<TaskManager />);

    const titleInput = screen.getByPlaceholderText(/task title/i);
    const descInput = screen.getByPlaceholderText(/description/i);
    const createButton = screen.getByRole('button', { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descInput, { target: { value: 'Details' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tasks'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'New Task', description: 'Details' }),
        })
      );
    });
  });
});
