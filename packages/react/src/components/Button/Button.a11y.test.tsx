import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Button } from './Button';

// jsdom can't lay out or paint, so axe's `color-contrast` rule (which needs
// canvas/getComputedStyle pixel data) can't run here — disable it. Contrast is
// instead verified against the token palette in docs/accessibility.md and via
// the Storybook a11y addon in a real browser.
const axeOptions = { rules: { 'color-contrast': { enabled: false } } } as const;

describe('Button a11y', () => {
  it('has no detectable axe violations (solid)', async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no detectable axe violations (loading)', async () => {
    const { container } = render(
      <Button loading loadingLabel="Loading">
        Submit
      </Button>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no detectable axe violations (as link)', async () => {
    const { container } = render(
      <Button as="a" href="#">
        Link
      </Button>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
