import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Ratio } from './Ratio';

describe('Ratio', () => {
  it('computes aspect ratio percentage from named ratio', () => {
    const { container } = render(
      <Ratio ratio="16x9">
        <iframe title="demo" />
      </Ratio>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('lily-ratio');
    expect(el.style.getPropertyValue('--lily-aspect-ratio')).toBe('56.25%');
  });

  it('supports a custom ratio pair', () => {
    const { container } = render(
      <Ratio ratio={[2, 1]}>
        <img alt="" />
      </Ratio>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--lily-aspect-ratio')).toBe('50%');
  });
});
