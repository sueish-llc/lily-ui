/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- test trigger surfaces are focusable so the keyboard path can be exercised */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { ContextMenu } from './ContextMenu';

describe('ContextMenu a11y', () => {
  it('has no violations when closed', async () => {
    const { container } = render(
      <ContextMenu
        menu={
          <>
            <ContextMenu.Item>Copy</ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item>Delete</ContextMenu.Item>
          </>
        }
      >
        <div tabIndex={0}>Right-click area</div>
      </ContextMenu>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations when open', async () => {
    const { container } = render(
      <ContextMenu
        open
        menu={
          <>
            <ContextMenu.Item>Copy</ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item>Delete</ContextMenu.Item>
          </>
        }
      >
        <div tabIndex={0}>Right-click area</div>
      </ContextMenu>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
