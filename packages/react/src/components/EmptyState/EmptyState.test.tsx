import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description and actions', () => {
    render(<EmptyState title="空です" description="まだありません" actions={<button>追加</button>} />);
    expect(screen.getByText('空です')).toBeInTheDocument();
    expect(screen.getByText('まだありません')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });
});
