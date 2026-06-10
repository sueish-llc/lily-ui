import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('opens and closes on trigger', async () => {
    render(
      <Dropdown trigger="Menu">
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Delete</Dropdown.Item>
      </Dropdown>,
    );
    const trigger = screen.getByRole('button', { name: 'Menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeVisible();
  });
});
