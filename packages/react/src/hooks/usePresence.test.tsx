import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { usePresence } from './usePresence';

function Box({ present }: { present: boolean }) {
  const { isPresent, state, ref } = usePresence(present);
  if (!isPresent) return null;
  return <div data-testid="box" ref={ref} data-state={state} />;
}

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('data-motion');
});

describe('usePresence', () => {
  it('renders while present and reflects an open state', async () => {
    render(<Box present />);
    const box = await screen.findByTestId('box');
    await waitFor(() => expect(box).toHaveAttribute('data-state', 'open'));
  });

  it('stays mounted during exit, then unmounts on animationend', async () => {
    const { rerender } = render(<Box present />);
    const box = screen.getByTestId('box');

    rerender(<Box present={false} />);
    // Still mounted, now closed — the exit animation is playing.
    expect(screen.getByTestId('box')).toHaveAttribute('data-state', 'closed');

    fireEvent.animationEnd(box);
    await waitFor(() => expect(screen.queryByTestId('box')).toBeNull());
  });

  it('unmounts immediately under reduced motion (no event needed)', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (q: string) =>
        ({
          matches: q.includes('reduced-motion'),
          media: q,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );

    const { rerender } = render(<Box present />);
    rerender(<Box present={false} />);
    await waitFor(() => expect(screen.queryByTestId('box')).toBeNull());
  });

  it('falls back to a timeout when no animation event fires', async () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(<Box present />);
      rerender(<Box present={false} />);
      expect(screen.getByTestId('box')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(320);
      });
      expect(screen.queryByTestId('box')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
