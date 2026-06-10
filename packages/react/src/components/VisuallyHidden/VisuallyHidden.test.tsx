import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders a span by default', () => {
    render(<VisuallyHidden>hidden text</VisuallyHidden>);
    const el = screen.getByText('hidden text');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('lily-visually-hidden');
  });

  it('does not apply focusable modifier by default', () => {
    render(<VisuallyHidden>text</VisuallyHidden>);
    expect(screen.getByText('text')).not.toHaveClass('lily-visually-hidden--focusable');
  });

  it('applies focusable modifier when focusable is true', () => {
    render(<VisuallyHidden focusable>text</VisuallyHidden>);
    expect(screen.getByText('text')).toHaveClass('lily-visually-hidden--focusable');
  });

  it('renders as a different element via as prop', () => {
    render(
      <VisuallyHidden as="a" href="#main">
        Skip
      </VisuallyHidden>,
    );
    const el = screen.getByText('Skip');
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '#main');
  });

  it('forwards className', () => {
    render(<VisuallyHidden className="extra">text</VisuallyHidden>);
    expect(screen.getByText('text')).toHaveClass('lily-visually-hidden', 'extra');
  });
});
