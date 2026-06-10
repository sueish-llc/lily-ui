import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { CommandPalette } from './CommandPalette';

describe('CommandPalette a11y', () => {
  it('has no violations (open)', async () => {
    const { container } = render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        onSelect={() => {}}
        hotkey={false}
        aria-label="コマンドパレット"
        items={[
          { id: 'new', label: '新規作成', group: 'ファイル', shortcut: '⌘N' },
          { id: 'settings', label: '設定', group: 'その他' },
        ]}
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
