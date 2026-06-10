import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from './CommandPalette';

const cmds = [
  { id: 'new', label: '新規作成', group: 'ファイル', shortcut: '⌘N' },
  { id: 'open', label: '開く', group: 'ファイル' },
  { id: 'settings', label: '設定', group: 'その他', keywords: ['preferences'] },
];

describe('CommandPalette', () => {
  it('opens, filters, and selects with the keyboard', async () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(<CommandPalette open onOpenChange={onOpenChange} items={cmds} onSelect={onSelect} hotkey={false} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'preferences');
    // keyword match surfaces 設定.
    expect(screen.getByRole('option', { name: /設定/ })).toBeInTheDocument();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('settings');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('renders nothing when closed', () => {
    const { container } = render(<CommandPalette open={false} onOpenChange={() => {}} items={cmds} onSelect={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
