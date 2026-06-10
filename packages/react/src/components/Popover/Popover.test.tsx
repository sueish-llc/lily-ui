import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';

describe('Popover', () => {
  it('toggles on click with dialog semantics', async () => {
    render(
      <Popover title="Info" content="Details">
        <button>More</button>
      </Popover>,
    );
    const btn = screen.getByRole('button', { name: 'More' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog')).toHaveTextContent('Details');
  });
});
