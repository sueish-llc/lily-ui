import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Countdown } from './Countdown';

describe('Countdown', () => {
  afterEach(() => vi.useRealTimers());

  it('renders with role="timer"', () => {
    const target = Temporal.Now.plainDateTimeISO().add({ hours: 1 });
    render(<Countdown to={target} live={false} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('applies the lily-countdown class', () => {
    const target = Temporal.Now.plainDateTimeISO().add({ hours: 1 });
    const { container } = render(<Countdown to={target} live={false} />);
    expect(container.firstChild).toHaveClass('lily-countdown');
  });

  it('shows four segments in dhms format', () => {
    const target = Temporal.Now.plainDateTimeISO().add({ days: 2, hours: 3 });
    render(<Countdown to={target} format="dhms" live={false} />);
    const labels = screen.getAllByText(/^[dhms]$/);
    // d, h, m, s
    expect(labels).toHaveLength(4);
  });

  it('shows three segments in hms format', () => {
    const target = Temporal.Now.plainDateTimeISO().add({ hours: 5 });
    render(<Countdown to={target} format="hms" live={false} />);
    const labels = screen.getAllByText(/^[hms]$/);
    expect(labels).toHaveLength(3);
  });

  it('shows all zeros for an expired target', () => {
    const past = Temporal.Now.plainDateTimeISO().subtract({ hours: 1 });
    render(<Countdown to={past} live={false} />);
    const values = screen.getAllByText('00');
    expect(values.length).toBeGreaterThanOrEqual(3);
  });

  it('calls onComplete when the countdown reaches zero', async () => {
    vi.useFakeTimers();
    // Native Temporal.Now reads the host clock, which fake timers do not move.
    // Drive the clock through a mock that both the component (via
    // remainingDuration) and the target instant share, so the test behaves the
    // same on native Temporal and the polyfill.
    let now = Temporal.Instant.from('2026-01-01T00:00:00Z');
    const nowSpy = vi.spyOn(Temporal.Now, 'instant').mockImplementation(() => now);
    try {
      const onComplete = vi.fn();
      // Target 2 seconds from the mocked now.
      const target = now.toZonedDateTimeISO('UTC').add({ seconds: 2 });
      render(<Countdown to={target} onComplete={onComplete} live />);
      expect(onComplete).not.toHaveBeenCalled();
      // Move the clock past the target, then let the per-second ticker run.
      await act(async () => {
        now = now.add({ seconds: 3 });
        vi.advanceTimersByTime(3000);
      });
      expect(onComplete).toHaveBeenCalledTimes(1);
    } finally {
      nowSpy.mockRestore();
    }
  });

  it('accepts an ISO string target', () => {
    const iso = Temporal.Now.plainDateTimeISO().add({ hours: 1 }).toString();
    render(<Countdown to={iso} live={false} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('merges a custom className', () => {
    const target = Temporal.Now.plainDateTimeISO().add({ hours: 1 });
    const { container } = render(<Countdown to={target} live={false} className="extra" />);
    expect(container.firstChild).toHaveClass('lily-countdown', 'extra');
  });
});
