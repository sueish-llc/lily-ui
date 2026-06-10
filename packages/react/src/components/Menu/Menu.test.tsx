import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu } from './Menu';

describe('Menu', () => {
  it('activates an item and supports arrow navigation', async () => {
    const onSelect = vi.fn();
    render(
      <Menu
        aria-label="操作"
        onSelect={onSelect}
        items={[
          { label: '編集', value: 'edit' },
          { divider: true },
          { label: '削除', value: 'delete' },
        ]}
      />,
    );
    expect(screen.getByRole('menu', { name: '操作' })).toBeInTheDocument();
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    items[0]!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();
    await userEvent.click(items[1]!);
    expect(onSelect).toHaveBeenCalledWith('delete', 2);
  });
});
