import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('disables previous on first page and calls onChange', async () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('marks the current page', () => {
    render(<Pagination count={5} page={3} onChange={() => {}} />);
    const current = screen.getByRole('button', { name: 'Page 3' }).closest('li');
    expect(current).toHaveAttribute('aria-current', 'page');
  });
});
