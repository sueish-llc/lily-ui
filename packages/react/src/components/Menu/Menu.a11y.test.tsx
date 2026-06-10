import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Menu } from './Menu';

describe('Menu a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Menu
        aria-label="ファイル操作"
        items={[
          { label: '開く', value: 'open', shortcut: '⌘O' },
          { label: '複製', value: 'dup' },
          { divider: true },
          { label: '削除', value: 'delete', disabled: true },
        ]}
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
