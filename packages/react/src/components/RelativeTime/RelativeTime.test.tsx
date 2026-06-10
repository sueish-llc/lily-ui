import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { RelativeTime } from './RelativeTime';

describe('RelativeTime', () => {
  it('renders a <time> element with a dateTime attribute', () => {
    const inst = Temporal.Now.instant().subtract({ seconds: 3600 });
    render(<RelativeTime value={inst} />);
    const el = screen.getByRole('time');
    expect(el.tagName.toLowerCase()).toBe('time');
    expect(el).toHaveAttribute('dateTime');
  });

  it('applies the lily-relative-time class', () => {
    const inst = Temporal.Now.instant().subtract({ seconds: 60 });
    const { container } = render(<RelativeTime value={inst} />);
    expect(container.firstChild).toHaveClass('lily-relative-time');
  });

  it('merges a custom className', () => {
    const inst = Temporal.Now.instant();
    const { container } = render(<RelativeTime value={inst} className="my-class" />);
    expect(container.firstChild).toHaveClass('lily-relative-time', 'my-class');
  });

  it('formats a PlainDate value', () => {
    const date = Temporal.PlainDate.from('2020-01-01');
    render(<RelativeTime value={date} locale="en" />);
    const el = screen.getByRole('time');
    // Should produce something like "5 years ago"
    expect(el.textContent).toMatch(/year/);
  });

  it('accepts an ISO string', () => {
    const iso = Temporal.Now.instant().subtract({ seconds: 120 }).toString();
    render(<RelativeTime value={iso} locale="en" numeric="always" />);
    const el = screen.getByRole('time');
    expect(el).toHaveAttribute('dateTime', iso);
    expect(el.textContent?.length).toBeGreaterThan(0);
  });

  it('respects a custom base', () => {
    // value is 10 minutes after base → "in 10 minutes"
    const base = Temporal.Instant.from('2026-06-01T00:00:00Z');
    const value = Temporal.Instant.from('2026-06-01T00:10:00Z');
    render(<RelativeTime value={value} base={base} locale="en" numeric="always" />);
    const el = screen.getByRole('time');
    expect(el.textContent).toMatch(/10 minute/);
  });

  it('ticks when live is true', async () => {
    vi.useFakeTimers();
    const inst = Temporal.Now.instant().subtract({ seconds: 55 });
    render(<RelativeTime value={inst} live updateInterval={1000} locale="en" />);
    // Advance the timer to trigger a re-render tick.
    await act(async () => { vi.advanceTimersByTime(1000); });
    // The time element should still be in the DOM.
    expect(screen.getByRole('time')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('clamps updateInterval to a minimum of 1000ms (no busy loop at 0)', () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const inst = Temporal.Now.instant();
    render(<RelativeTime value={inst} live updateInterval={0} />);
    expect(setIntervalSpy).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    setIntervalSpy.mockRestore();
    vi.useRealTimers();
  });

  it('forwards extra props to the time element', () => {
    const inst = Temporal.Now.instant();
    render(<RelativeTime value={inst} data-testid="rt" />);
    expect(screen.getByTestId('rt').tagName.toLowerCase()).toBe('time');
  });
});
