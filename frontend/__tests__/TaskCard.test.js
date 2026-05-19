import { render, screen } from '@testing-library/react';
import TaskCard from '../components/TaskCard';

const mockTask = {
  _id: '507f1f77bcf86cd799439012',
  title: 'Test Task',
  description: 'Task description',
  status: 'todo',
  priority: 'medium',
  assignedTo: { name: 'John' },
};

describe('TaskCard', () => {
  it('renders task title and status', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('todo')).toBeInTheDocument();
    expect(screen.getByText(/Assigned: John/)).toBeInTheDocument();
  });

  it('renders with data-testid', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByTestId('task-card')).toBeInTheDocument();
  });
});
