import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { CopyButton } from './CopyButton';

describe('CopyButton a11y', () => {
  it('icon-only button has an accessible name and no violations', async () => {
    const { container, getByRole } = render(
      <CopyButton value="--lily-color-primary-100" copyLabel="コピー" />,
    );
    expect(getByRole('button', { name: 'コピー' })).toBeTruthy();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('labelled button has no violations', async () => {
    const { container } = render(<CopyButton value="#d22879" label="コピー" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
