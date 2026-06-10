import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden a11y', () => {
  it('has no violations with default span', async () => {
    const { container } = render(
      <p>
        Visible text
        <VisuallyHidden> (screen reader label)</VisuallyHidden>
      </p>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with focusable skip link', async () => {
    const { container } = render(
      <div>
        <VisuallyHidden as="a" focusable href="#main">
          Skip to main content
        </VisuallyHidden>
        <main id="main">
          <p>Content</p>
        </main>
      </div>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
