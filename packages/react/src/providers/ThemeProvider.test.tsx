import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
  // CI's jsdom may lack localStorage entirely (see CLAUDE.md) — don't assume it.
  window.localStorage?.clear();
});

describe('ThemeProvider color overrides', () => {
  it('renders no style element when no overrides are given', () => {
    const { container } = render(
      <ThemeProvider>
        <p>内容</p>
      </ThemeProvider>,
    );
    expect(container.querySelector('style')).toBeNull();
  });

  it('applies overrides at :root for both schemes', () => {
    const { container } = render(
      <ThemeProvider colors={{ primary: '#115e59' }}>
        <p>内容</p>
      </ThemeProvider>,
    );
    const cssText = container.querySelector('style')!.textContent!;
    expect(cssText).toContain(":root[data-theme='light'] { --lily-color-primary: #115e59; }");
    expect(cssText).toContain(":root[data-theme='dark'] { --lily-color-primary: #115e59; }");
    expect(cssText).toContain('@media (prefers-color-scheme: dark)');
    // App-wide rules are not scoped to a wrapper element.
    expect(cssText).not.toContain("[data-lily-theme-override='");
  });

  it('mounts without localStorage (CI/minimal jsdom runtimes)', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', { value: undefined, configurable: true });
    try {
      const { container } = render(
        <ThemeProvider colors={{ primary: '#115e59' }}>
          <p>内容</p>
        </ThemeProvider>,
      );
      expect(container.querySelector('style')).not.toBeNull();
    } finally {
      if (original) Object.defineProperty(window, 'localStorage', original);
    }
  });

  it('lets scheme overrides win over common ones', () => {
    const { container } = render(
      <ThemeProvider colors={{ primary: '#115e59' }} dark={{ primary: '#5eead4' }}>
        <p>内容</p>
      </ThemeProvider>,
    );
    const cssText = container.querySelector('style')!.textContent!;
    expect(cssText).toContain(":root[data-theme='light'] { --lily-color-primary: #115e59; }");
    expect(cssText).toContain(":root[data-theme='dark'] { --lily-color-primary: #5eead4; }");
  });
});
