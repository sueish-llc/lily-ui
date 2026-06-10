import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MotionProvider, useMotionLevel } from './MotionProvider';

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('data-motion');
  // `localStorage` is absent in some runtimes (e.g. CI's jsdom) — guard it.
  window.localStorage?.clear();
});

function Readout() {
  const { level, setPreference } = useMotionLevel();
  return (
    <div>
      <span data-testid="level">{level}</span>
      <button onClick={() => setPreference('none')}>off</button>
    </div>
  );
}

describe('MotionProvider', () => {
  it('reflects an explicit tier onto <html data-motion>', async () => {
    render(
      <MotionProvider defaultPreference="minimal">
        <Readout />
      </MotionProvider>,
    );
    await waitFor(() =>
      expect(document.documentElement.getAttribute('data-motion')).toBe('minimal'),
    );
    expect(screen.getByTestId('level')).toHaveTextContent('minimal');
  });

  it('lets a consumer switch tiers at runtime', async () => {
    render(
      <MotionProvider defaultPreference="full">
        <Readout />
      </MotionProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'off' }));
    await waitFor(() =>
      expect(document.documentElement.getAttribute('data-motion')).toBe('none'),
    );
  });

  it('resolves auto to none when the OS prefers reduced motion', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (q: string) =>
        ({
          matches: q.includes('reduced-motion'),
          media: q,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    render(
      <MotionProvider defaultPreference="auto">
        <Readout />
      </MotionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('level')).toHaveTextContent('none'));
  });

  it('useMotionLevel works without a provider', () => {
    render(<Readout />);
    expect(screen.getByTestId('level')).toBeInTheDocument();
  });
});
