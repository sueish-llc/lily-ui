import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeOverride } from './ThemeOverride';
import { contrastRatio, findContrastIssues } from '../../utils/themeOverride';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ThemeOverride', () => {
  it('renders children inside the scoped wrapper', () => {
    render(
      <ThemeOverride colors={{ primary: '#115e59' }}>
        <p>内容</p>
      </ThemeOverride>,
    );
    const wrapper = screen.getByText('内容').closest('[data-lily-theme-override]');
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveClass('lily-theme-override');
  });

  it('emits scheme-independent overrides scoped to its own attribute', () => {
    const { container } = render(
      <ThemeOverride colors={{ primary: '#115e59', 'on-primary': '#ffffff' }} />,
    );
    const id = container
      .querySelector('[data-lily-theme-override]')!
      .getAttribute('data-lily-theme-override')!;
    const cssText = container.querySelector('style')!.textContent!;
    expect(cssText).toContain(`[data-lily-theme-override='${id}']`);
    expect(cssText).toContain('--lily-color-primary: #115e59;');
    expect(cssText).toContain('--lily-color-on-primary: #ffffff;');
  });

  it('scopes light/dark overrides to the active scheme', () => {
    const { container } = render(
      <ThemeOverride light={{ 'bg-canvas': '#fffbeb' }} dark={{ 'bg-canvas': '#101418' }} />,
    );
    const cssText = container.querySelector('style')!.textContent!;
    expect(cssText).toContain(":root[data-theme='light']");
    expect(cssText).toContain('@media (prefers-color-scheme: light)');
    expect(cssText).toContain('--lily-color-bg-canvas: #fffbeb;');
    expect(cssText).toContain(":root[data-theme='dark']");
    expect(cssText).toContain('@media (prefers-color-scheme: dark)');
    expect(cssText).toContain('--lily-color-bg-canvas: #101418;');
  });

  it('renders no style element when there is nothing to override', () => {
    const { container } = render(
      <ThemeOverride>
        <p>内容</p>
      </ThemeOverride>,
    );
    expect(container.querySelector('style')).toBeNull();
  });

  it('drops unsafe values and token names instead of emitting them', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <ThemeOverride
        colors={{ primary: '} body { background: red', 'bad token': '#fff', accent: '#7c3aed' }}
      />,
    );
    const cssText = container.querySelector('style')!.textContent!;
    expect(cssText).not.toContain('background: red');
    expect(cssText).not.toContain('bad token');
    expect(cssText).toContain('--lily-color-accent: #7c3aed;');
  });

  it('warns in dev when an overridden text/background pair falls below AAA', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ThemeOverride colors={{ primary: '#888888', 'on-primary': '#777777' }} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('WCAG AAA'));
  });

  it('does not warn for an AAA-compliant pair', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ThemeOverride colors={{ primary: '#115e59', 'on-primary': '#ffffff' }} />);
    expect(warn).not.toHaveBeenCalled();
  });

  it('forwards className, ref, and rest props to the wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ThemeOverride ref={ref} className="custom" data-testid="scope">
        <p>内容</p>
      </ThemeOverride>,
    );
    const wrapper = screen.getByTestId('scope');
    expect(wrapper).toHaveClass('lily-theme-override', 'custom');
    expect(ref.current).toBe(wrapper);
  });
});

describe('contrastRatio', () => {
  it('computes 21:1 for black on white', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 1);
  });

  it('parses rgb() notation', () => {
    expect(contrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)')).toBeCloseTo(21, 1);
  });

  it('returns null for values it cannot parse', () => {
    expect(contrastRatio('var(--x)', '#fff')).toBeNull();
    expect(contrastRatio('#00000080', '#fff')).toBeNull();
  });
});

describe('findContrastIssues', () => {
  it('flags a failing dark-only pair with scheme "dark"', () => {
    const issues = findContrastIssues({ dark: { primary: '#888888', 'on-primary': '#777777' } });
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      scheme: 'dark',
      foreground: { token: 'on-primary' },
      background: { token: 'primary' },
    });
    expect(issues[0]?.ratio).toBeLessThan(7);
  });

  it('collapses a pair failing identically in both schemes into "both"', () => {
    const issues = findContrastIssues({ colors: { primary: '#888888', 'on-primary': '#777777' } });
    expect(issues).toHaveLength(1);
    expect(issues[0]?.scheme).toBe('both');
  });

  it('accepts an AAA-compliant pair', () => {
    expect(
      findContrastIssues({ colors: { primary: '#115e59', 'on-primary': '#ffffff' } }),
    ).toEqual([]);
  });

  it('skips pairs where only one side is overridden', () => {
    expect(findContrastIssues({ colors: { primary: '#888888' } })).toEqual([]);
  });
});
