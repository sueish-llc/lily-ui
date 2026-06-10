/* Theme switcher: cycles light → dark → system, writes `data-theme` on <html>
 * and persists to `lily-theme` (the same contract as @lily-ui/react's
 * ThemeProvider). All browser globals are guarded for SSR/minimal runtimes. */
import * as React from 'react';

type Mode = 'light' | 'dark' | 'system';
const ORDER: Mode[] = ['light', 'dark', 'system'];
const KEY = 'lily-theme';

function readMode(): Mode {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return 'system';
}

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
  try {
    if (mode === 'system') window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, mode);
  } catch {
    /* ignore */
  }
}

const ICON: Record<Mode, React.ReactNode> = {
  light: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1="12"
          y1="1.6"
          x2="12"
          y2="4.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M20 14.5A8 8 0 1 1 9.5 4a6.4 6.4 0 0 0 10.5 10.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.6a8.4 8.4 0 0 1 0 16.8Z" fill="currentColor" />
    </svg>
  ),
};

export interface ThemeToggleProps {
  labels: { toggle: string; light: string; dark: string; system: string };
}

export default function ThemeToggle({ labels }: ThemeToggleProps) {
  const [mode, setMode] = React.useState<Mode>('system');
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setMode(readMode());
    setReady(true);
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    apply(next);
  };

  const labelFor: Record<Mode, string> = {
    light: labels.light,
    dark: labels.dark,
    system: labels.system,
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycle}
      aria-label={`${labels.toggle} (${labelFor[mode]})`}
      title={`${labels.toggle}: ${labelFor[mode]}`}
    >
      <span className="theme-toggle__icon">{ICON[mode]}</span>
      <span className="theme-toggle__label">{ready ? labelFor[mode] : labelFor.system}</span>
    </button>
  );
}
