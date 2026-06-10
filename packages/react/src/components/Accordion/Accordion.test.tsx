import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  const items = [
    { id: 'a', header: 'A', content: 'Body A' },
    { id: 'b', header: 'B', content: 'Body B' },
  ];

  it('toggles panels (single mode)', async () => {
    render(<Accordion items={items} />);
    const a = screen.getByRole('button', { name: 'A' });
    expect(a).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(a);
    expect(a).toHaveAttribute('aria-expanded', 'true');
    // Opening B closes A in single mode.
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(a).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows multiple open when multiple', async () => {
    render(<Accordion items={items} multiple />);
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'true');
  });
});
