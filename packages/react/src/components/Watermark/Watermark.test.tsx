import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Watermark } from './Watermark';

describe('Watermark', () => {
  it('renders the root class', () => {
    const { container } = render(<Watermark text="Draft"><p>content</p></Watermark>);
    expect(container.querySelector('.lily-watermark')).not.toBeNull();
  });

  it('renders children', () => {
    render(<Watermark text="Draft"><p>visible content</p></Watermark>);
    expect(screen.getByText('visible content')).not.toBeNull();
  });

  it('renders the overlay with aria-hidden', () => {
    const { container } = render(<Watermark text="Draft"><p>x</p></Watermark>);
    const overlay = container.querySelector('.lily-watermark__overlay');
    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute('aria-hidden')).toBe('true');
  });

  it('overlay has pointer-events none via class (not inline style)', () => {
    const { container } = render(<Watermark text="Draft"><p>x</p></Watermark>);
    // The overlay should NOT have pointer-events in inline style; CSS handles it.
    const overlay = container.querySelector('.lily-watermark__overlay') as HTMLElement;
    expect(overlay.style.pointerEvents).toBeFalsy();
  });

  it('applies custom opacity to the overlay', () => {
    const { container } = render(<Watermark text="Draft" opacity={0.2}><p>x</p></Watermark>);
    const overlay = container.querySelector('.lily-watermark__overlay') as HTMLElement;
    expect(overlay.style.opacity).toBe('0.2');
  });

  it('merges className on the wrapper', () => {
    const { container } = render(<Watermark text="x" className="custom"><p>y</p></Watermark>);
    expect(container.querySelector('.lily-watermark.custom')).not.toBeNull();
  });

  it('forwards extra props to the wrapper div', () => {
    const { container } = render(<Watermark text="x" data-testid="wm"><p>y</p></Watermark>);
    expect(container.querySelector('[data-testid="wm"]')).not.toBeNull();
  });
});
