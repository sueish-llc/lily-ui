import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { BackTop } from './BackTop';

describe('BackTop', () => {
  it('is hidden until scrolled past the threshold', () => {
    const { container } = render(<BackTop visibilityHeight={100} label="トップへ" />);
    const btn = container.querySelector('.lily-back-top') as HTMLElement;
    expect(btn).not.toBeVisible();
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(btn).toBeVisible();
    expect(btn).toHaveAttribute('aria-label', 'トップへ');
  });
});
