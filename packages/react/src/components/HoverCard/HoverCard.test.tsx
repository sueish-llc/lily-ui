import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HoverCard } from './HoverCard';

describe('HoverCard', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const setup = (props = {}) =>
    render(
      <HoverCard content={<p>Card body</p>} {...props}>
        <button>Trigger</button>
      </HoverCard>,
    );

  it('is hidden by default and renders the card markup', () => {
    setup();
    const card = screen.getByRole('tooltip', { hidden: true });
    expect(card).toHaveClass('lily-hover-card', 'lily-hover-card--bottom');
    expect(card).toHaveAttribute('hidden');
  });

  it('opens after the open delay on hover and closes after the close delay', () => {
    setup({ openDelay: 100, closeDelay: 50 });
    const trigger = screen.getByRole('button', { name: 'Trigger' });

    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('hidden');
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole('tooltip')).not.toHaveAttribute('hidden');

    fireEvent.mouseLeave(trigger);
    act(() => vi.advanceTimersByTime(50));
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('hidden');
  });

  it('opens immediately on focus and closes on blur (keyboard path)', () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Trigger' });

    fireEvent.focus(trigger);
    expect(screen.getByRole('tooltip')).not.toHaveAttribute('hidden');
    expect(trigger).toHaveAttribute('aria-describedby');

    fireEvent.blur(trigger);
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('hidden');
  });

  it('closes on Escape', () => {
    setup();
    fireEvent.focus(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.getByRole('tooltip')).not.toHaveAttribute('hidden');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('hidden');
  });

  it('supports the controlled API via open/onOpenChange', () => {
    const onOpenChange = vi.fn();
    setup({ open: true, onOpenChange });
    expect(screen.getByRole('tooltip')).not.toHaveAttribute('hidden');
    fireEvent.blur(screen.getByRole('button', { name: 'Trigger' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
