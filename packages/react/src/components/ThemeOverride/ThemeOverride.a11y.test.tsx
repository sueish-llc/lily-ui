import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ThemeOverride } from './ThemeOverride';

const axeOptions = { rules: { 'color-contrast': { enabled: false } } } as const;
// Color contrast is skipped in jsdom (no pixel rendering); overridden pairs are
// instead checked numerically by findContrastIssues (see ThemeOverride.test.tsx).

describe('ThemeOverride a11y', () => {
  it('has no detectable axe violations', async () => {
    const { container } = render(
      <ThemeOverride
        colors={{ primary: '#115e59', 'on-primary': '#ffffff' }}
        dark={{ 'bg-canvas': '#101418' }}
      >
        <button type="button">保存する</button>
      </ThemeOverride>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
