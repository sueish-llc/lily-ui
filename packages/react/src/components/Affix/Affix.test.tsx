import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Affix } from './Affix';

describe('Affix', () => {
  it('applies the sticky offset', () => {
    const { container } = render(<Affix offset={16}>x</Affix>);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('lily-affix');
    expect(el.style.getPropertyValue('--lily-affix-offset')).toBe('16px');
  });
});
