import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows on focus and links via aria-describedby', async () => {
    render(
      <Tooltip content="Hint">
        <button>Trigger</button>
      </Tooltip>,
    );
    const btn = screen.getByRole('button', { name: 'Trigger' });
    btn.focus();
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('Hint');
    expect(btn).toHaveAttribute('aria-describedby', tip.id);
  });
});
