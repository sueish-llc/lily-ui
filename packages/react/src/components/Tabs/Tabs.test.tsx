import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  const items = [
    { id: 't1', label: 'One', content: 'First' },
    { id: 't2', label: 'Two', content: 'Second' },
  ];

  it('selects via click and arrow keys', async () => {
    render(<Tabs label="Demo" items={items} />);
    const tab1 = screen.getByRole('tab', { name: 'One' });
    const tab2 = screen.getByRole('tab', { name: 'Two' });
    expect(tab1).toHaveAttribute('aria-selected', 'true');

    tab1.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Second')).toBeVisible();
  });
});
