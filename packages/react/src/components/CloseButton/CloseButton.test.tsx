import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CloseButton } from './CloseButton';

describe('CloseButton', () => {
  it('is a labeled button and fires onClick', async () => {
    const onClick = vi.fn();
    render(<CloseButton onClick={onClick} label="Dismiss" />);
    const btn = screen.getByRole('button', { name: 'Dismiss' });
    expect(btn).toHaveAttribute('type', 'button');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
