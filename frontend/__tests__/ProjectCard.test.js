import { render, screen } from '@testing-library/react';
import ProjectCard from '../components/ProjectCard';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

const mockProject = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Test Project',
  description: 'A sample project description',
  status: 'active',
  priority: 'high',
  coverImageUrl: '',
};

describe('ProjectCard', () => {
  it('renders project title and status', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = jest.fn();
    render(<ProjectCard project={mockProject} onDelete={onDelete} />);
    screen.getByText('Delete').click();
    expect(onDelete).toHaveBeenCalledWith(mockProject._id);
  });
});
