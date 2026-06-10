import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Presence } from './Presence';

describe('Presence', () => {
  it('renders the child with the entrance animation', () => {
    render(
      <Presence present enter="zoom-in" exit="zoom-out">
        <div data-testid="child">hi</div>
      </Presence>,
    );
    const child = screen.getByTestId('child');
    expect(child).toHaveClass('lily-animate', 'lily-animate--zoom-in');
    expect(child).toHaveAttribute('data-state', 'open');
  });

  it('plays the exit animation, then unmounts', async () => {
    const { rerender } = render(
      <Presence present enter="zoom-in" exit="zoom-out">
        <div data-testid="child">hi</div>
      </Presence>,
    );
    rerender(
      <Presence present={false} enter="zoom-in" exit="zoom-out">
        <div data-testid="child">hi</div>
      </Presence>,
    );
    const child = screen.getByTestId('child');
    expect(child).toHaveClass('lily-animate--zoom-out');

    fireEvent.animationEnd(child);
    await waitFor(() => expect(screen.queryByTestId('child')).toBeNull());
  });

  it('preserves the child className', () => {
    render(
      <Presence present>
        <div data-testid="child" className="card" />
      </Presence>,
    );
    expect(screen.getByTestId('child')).toHaveClass('card', 'lily-animate');
  });
});
