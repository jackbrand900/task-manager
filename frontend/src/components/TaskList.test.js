import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from './TaskList';

describe('TaskList', () => {
  const defaultProps = {
    onStart: jest.fn(),
    onPause: jest.fn(),
    onResume: jest.fn(),
    onCancel: jest.fn(),
    onDelete: jest.fn(),
    sortOption: 'created-newest',
    filterStatus: 'all',
  };

  const mockTasks = [
    {
      id: '1',
      title: 'Pending Task',
      description: 'A pending task',
      status: 'Pending',
      createdAt: Date.now(),
      duration: 30000,
      remaining: 30000,
    },
    {
      id: '2',
      title: 'In Progress Task',
      description: 'Running...',
      status: 'In Progress',
      createdAt: Date.now(),
      startedAt: Date.now() - 10000,
      duration: 30000,
      remaining: 20000,
    },
    {
      id: '3',
      title: 'Paused Task',
      description: 'Paused state',
      status: 'Paused',
      createdAt: Date.now(),
      duration: 30000,
      remaining: 15000,
    },
    {
      id: '4',
      title: 'Completed Task',
      description: '',
      status: 'Completed',
      createdAt: Date.now(),
      completedAt: Date.now(),
    },
  ];

  it('renders tasks grouped by status', () => {
    render(<TaskList {...defaultProps} tasks={mockTasks} />);

    const activeSection = screen.getByRole('heading', { name: /active \/ paused tasks/i }).closest('.task-section');
    const completedSection = screen.getByRole('heading', { name: /completed \/ cancelled tasks/i }).closest('.task-section');

    const activeHeadings = within(activeSection).getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    const completedHeadings = within(completedSection).getAllByRole('heading', { level: 3 }).map(h => h.textContent);

    expect(activeHeadings).toEqual(expect.arrayContaining(['Pending Task', 'In Progress Task', 'Paused Task']));
    expect(completedHeadings).toEqual(expect.arrayContaining(['Completed Task']));
  });

  it('filters tasks by status', () => {
    render(<TaskList {...defaultProps} tasks={mockTasks} filterStatus="Paused" />);

    const activeSection = screen.getByRole('heading', { name: /active \/ paused tasks/i }).closest('.task-section');
    const completedSection = screen.getByRole('heading', { name: /completed \/ cancelled tasks/i }).closest('.task-section');

    const activeHeadings = within(activeSection).queryAllByRole('heading', { level: 3 }).map(h => h.textContent);
    const completedHeadings = within(completedSection).queryAllByRole('heading', { level: 3 }).map(h => h.textContent);

    expect(activeHeadings).toEqual(['Paused Task']);
    expect(completedHeadings).toEqual([]);
  });
});
