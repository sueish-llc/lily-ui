import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rating } from './Rating';

describe('Rating', () => {
  it('is a radiogroup and selecting sets the value', async () => {
    const onChange = vi.fn();
    render(<Rating label="評価" onChange={onChange} />);
    expect(screen.getByRole('radiogroup', { name: '評価' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: '4 / 5' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('readOnly renders a labeled image', () => {
    render(<Rating value={3} readOnly />);
    expect(screen.getByRole('img', { name: '3 / 5' })).toBeInTheDocument();
  });
});
