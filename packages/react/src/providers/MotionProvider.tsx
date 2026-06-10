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
  MOTION_ATTR,
  detectMotionLevel,
  resolveMotionLevel,
  type MotionLevel,
  type MotionPreference,
} from '../motion/level';

/**
 * Motion-tier handling — seamlessly trade silky-smooth motion for the bare
 * minimum on low-end devices, independent of `prefers-reduced-motion`.
 *
 * - `'full'` plays the rich animations; `'minimal'` collapses them to quick
 *   fades; `'none'` disables motion. `'auto'` resolves from device/OS signals.
 * - The resolved tier is written to `document.documentElement[data-motion]`,
 *   which the `@lily-ui/css` layer reacts to — flipping it re-styles instantly,
 *   no reload. Presence/animate helpers read the same attribute.
 * - SSR-safe: reads nothing from `window` during render; syncs in an effect.
 */
interface MotionContextValue {
  /** The user's selected preference (may be `'auto'`). */
  preference: MotionPreference;
  /** The concrete tier currently applied. */
  level: MotionLevel;
  setPreference: (preference: MotionPreference) => void;
}

const MotionContext = createContext<MotionContextValue | null>(null);

const STORAGE_KEY = 'lily-motion';

export interface MotionProviderProps {
  children: ReactNode;
  /** Initial preference before any stored value is read. Default: `'auto'`. */
  defaultPreference?: MotionPreference;
  /** Persist the user's choice to localStorage. Default: true. */
  enablePersistence?: boolean;
  /** localStorage key. Default: `lily-motion`. */
  storageKey?: string;
}

export function MotionProvider({
  children,
  defaultPreference = 'auto',
  enablePersistence = true,
  storageKey = STORAGE_KEY,
}: MotionProviderProps) {
  const [preference, setPreferenceState] = useState<MotionPreference>(defaultPreference);
  // Resolved tier for `'auto'`; recomputed when device/OS signals change.
  const [autoLevel, setAutoLevel] = useState<MotionLevel>('full');

  // Hydrate stored preference after mount (avoids SSR mismatch). Guard
  // `localStorage`: it is absent in SSR and some minimal test runtimes.
  useEffect(() => {
    if (!enablePersistence || typeof window === 'undefined' || !window.localStorage) return;
    const stored = window.localStorage.getItem(storageKey) as MotionPreference | null;
    if (stored === 'auto' || stored === 'full' || stored === 'minimal' || stored === 'none') {
      setPreferenceState(stored);
    }
  }, [enablePersistence, storageKey]);

  // Track reduced-motion changes so `'auto'` stays correct.
  useEffect(() => {
    setAutoLevel(detectMotionLevel());
    if (!window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setAutoLevel(detectMotionLevel());
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const level: MotionLevel = preference === 'auto' ? autoLevel : preference;

  // Reflect the resolved tier onto <html> for the CSS layer.
  useEffect(() => {
    document.documentElement.setAttribute(MOTION_ATTR, level);
  }, [level]);

  const setPreference = useCallback(
    (next: MotionPreference) => {
      setPreferenceState(next);
      if (enablePersistence && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, next);
      }
    },
    [enablePersistence, storageKey],
  );

  const value = useMemo<MotionContextValue>(
    () => ({ preference, level, setPreference }),
    [preference, level, setPreference],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

/**
 * Access the current motion tier. Returns a read-only view when used outside a
 * {@link MotionProvider}, so leaf helpers never need the provider to exist.
 */
export function useMotionLevel(): MotionContextValue {
  const ctx = useContext(MotionContext);
  if (ctx) return ctx;
  return {
    preference: 'auto',
    level: typeof window === 'undefined' ? 'full' : resolveMotionLevel('auto'),
    setPreference: () => {},
  };
}

/**
 * Inline script that applies the stored motion tier *before* React hydrates,
 * preventing a flash of full-motion on devices that prefer less. Render once in
 * your document <head>.
 */
export function MotionScript({ storageKey = STORAGE_KEY }: { storageKey?: string }) {
  // The only interpolated value is JSON-encoded, so it is always a safe literal.
  // `<` is additionally escaped so a key containing `</script>` cannot
  // terminate the inline script element early.
  const key = JSON.stringify(storageKey).replace(/</g, '\\u003c');
  const js = `(function(){try{var p=localStorage.getItem(${key})||'auto';var l=p;if(p==='auto'){l=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'none':'full';}document.documentElement.setAttribute('data-motion',l);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
