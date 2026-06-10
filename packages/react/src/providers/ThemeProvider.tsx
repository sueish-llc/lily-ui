import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  buildThemeOverrideCss,
  warnContrastIssues,
  type ThemeColorOverrides,
} from '../utils/themeOverride';

/**
 * Theme handling for SSR/SSG-safe dark mode & custom color themes.
 *
 * - `'light' | 'dark'` pin a theme; `'system'` follows the OS preference.
 * - The choice is written to `document.documentElement[data-theme]`, which the
 *   `@lily-ui/css` layer reacts to. No component re-styling needed.
 * - SSR-safe: reads nothing from `window` during render; syncs in an effect.
 * - To avoid a flash of the wrong theme, render {@link ThemeScript} in <head>.
 */
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** The user's selected mode (may be 'system'). */
  mode: ThemeMode;
  /** The concrete theme currently applied. */
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark (resolves 'system' first). */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'lily-theme';
const THEME_ATTR = 'data-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial mode before any stored preference is read. */
  defaultMode?: ThemeMode;
  /** Persist the user's choice to localStorage. Default: true. */
  enablePersistence?: boolean;
  /** localStorage key. Default: `lily-theme`. */
  storageKey?: string;
  /** App-wide color-token overrides applied in both schemes. */
  colors?: ThemeColorOverrides;
  /** App-wide color-token overrides applied only in the light scheme. */
  light?: ThemeColorOverrides;
  /** App-wide color-token overrides applied only in the dark scheme. */
  dark?: ThemeColorOverrides;
}

/**
 * ThemeProvider — establishes the Lily theme context for descendants, keeps
 * `<html data-theme>` in sync with the selected mode, and (optionally) applies
 * app-wide color-token overrides.
 *
 * Theme-wide concerns live here: mode selection/persistence and the
 * `colors` / `light` / `dark` token overrides, which target `:root` so they
 * also reach `body` backgrounds and overlays portaled to `body`. To re-color
 * only a subtree, use `ThemeOverride` instead — it never affects anything
 * outside its children.
 *
 * **Accessibility caution:** the default palette is verified against WCAG 2.1
 * AAA (7:1 text contrast); colors you pick yourself carry no such guarantee.
 * Overridden text/background pairs are checked in development, and end-user
 * picks should be validated with `findContrastIssues` before applying.
 *
 * @example
 * ```tsx
 * <ThemeProvider
 *   defaultMode="system"
 *   colors={{ primary: '#115e59', 'on-primary': '#ffffff' }}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultMode = 'system',
  enablePersistence = true,
  storageKey = STORAGE_KEY,
  colors,
  light,
  dark,
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');

  // Hydrate stored preference after mount (avoids SSR mismatch). Guard
  // `localStorage`: it is absent in SSR and some minimal test runtimes.
  useEffect(() => {
    if (!enablePersistence || typeof window === 'undefined' || !window.localStorage) return;
    const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setModeState(stored);
    }
  }, [enablePersistence, storageKey]);

  // Track OS preference changes.
  useEffect(() => {
    setSystemTheme(getSystemTheme());
    if (!window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemTheme(getSystemTheme());
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme: ResolvedTheme = mode === 'system' ? systemTheme : mode;

  // Reflect the resolved theme onto <html> for the CSS layer.
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'system') {
      root.removeAttribute(THEME_ATTR); // let CSS prefers-color-scheme drive it
    } else {
      root.setAttribute(THEME_ATTR, mode);
    }
  }, [mode, resolvedTheme]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      if (enablePersistence && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, next);
      }
    },
    [enablePersistence, storageKey],
  );

  const toggle = useCallback(() => {
    setMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolvedTheme, setMode, toggle }),
    [mode, resolvedTheme, setMode, toggle],
  );

  // App-wide token overrides, emitted as scheme-strength `:root` rules so they
  // follow the active scheme purely in CSS (and win over the base stylesheet).
  const overrideCss = buildThemeOverrideCss('', { colors, light, dark, global: true });

  // Dev-only AAA guard, keyed on the generated CSS so it re-runs only when the
  // effective overrides change, not on every render.
  useEffect(() => {
    warnContrastIssues({ colors, light, dark }, 'ThemeProvider');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrideCss]);

  return (
    <ThemeContext.Provider value={value}>
      {overrideCss ? <style>{overrideCss}</style> : null}
      {children}
    </ThemeContext.Provider>
  );
}

/** Access the current theme. Throws if used outside a {@link ThemeProvider}. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>.');
  return ctx;
}

/**
 * Inline script that applies the stored/OS theme *before* React hydrates,
 * preventing a flash of incorrect theme (FOUC). Render once in your document
 * <head> (e.g. Next.js `app/layout.tsx` or `_document`).
 *
 * @example
 * <head><ThemeScript /></head>
 */
export function ThemeScript({ storageKey = STORAGE_KEY }: { storageKey?: string }) {
  // An inline <script> is the only way to apply the theme before first paint
  // (React hooks run after hydration, which is too late to prevent FOUC).
  // The script body is a fixed template; the only interpolated value,
  // `storageKey`, is JSON-encoded so it is always a safe string literal and
  // cannot break out of the script context (no untrusted content is injected).
  // `<` is additionally escaped so a key containing `</script>` cannot
  // terminate the inline script element early.
  const key = JSON.stringify(storageKey).replace(/</g, '\\u003c');
  const js = `(function(){try{var m=localStorage.getItem(${key});if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
