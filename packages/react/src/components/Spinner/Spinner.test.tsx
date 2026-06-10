import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('has role=status and an accessible label', () => {
    render(<Spinner label="送信中" />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass('lily-spinner', 'lily-spinner--border', 'lily-spinner--md');
    expect(screen.getByText('送信中')).toBeInTheDocument();
  });
});
