import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('applies axis and max-height', () => {
    const { container } = render(
      <ScrollArea axis="x" maxHeight={200}>
        x
      </ScrollArea>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('lily-scroll-area', 'lily-scroll-area--x');
    expect(el.style.maxHeight).toBe('200px');
  });
});
