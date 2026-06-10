import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Drawer } from './Drawer';

describe('Drawer a11y', () => {
  it('permanent drawer has no violations', async () => {
    const { container } = render(
      <Drawer variant="permanent" anchor="left" ariaLabel="セクション">
        <nav aria-label="セクション">
          <ul>
            <li>
              <a href="#a">概要</a>
            </li>
          </ul>
        </nav>
      </Drawer>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('temporary drawer (open) has no violations', async () => {
    render(
      <Drawer open onClose={() => {}} anchor="left" title="メニュー">
        <nav aria-label="メニュー">
          <ul>
            <li>
              <a href="#a">概要</a>
            </li>
          </ul>
        </nav>
      </Drawer>,
    );
    // The panel is portaled to <body>; scope axe to the whole document body.
    expect(await axe(document.body, axeOptions)).toHaveNoViolations();
  });
});
