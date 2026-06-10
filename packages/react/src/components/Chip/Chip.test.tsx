import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';

describe('Chip', () => {
  it('applies status as data-status', () => {
    render(<Chip status="info">React</Chip>);
    expect(screen.getByText('React').closest('.lily-chip')).toHaveAttribute('data-status', 'info');
  });

  it('renders a toggle button when clickable', async () => {
    const onClick = vi.fn();
    render(
      <Chip clickable selected onClick={onClick}>
        絞り込み
      </Chip>,
    );
    const btn = screen.getByRole('button', { name: '絞り込み' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders a remove button that fires onRemove', async () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>tag</Chip>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
