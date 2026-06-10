import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Footer } from './Footer';

describe('Footer a11y', () => {
  it('has no violations and exposes a contentinfo landmark', async () => {
    const { container, getByRole } = render(
      <Footer>
        <p>© 2026 Lily UI</p>
        <a href="#terms">利用規約</a>
      </Footer>,
    );
    expect(getByRole('contentinfo')).toBeTruthy();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
