import {
  computed,
  inject,
  provide,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue';

/**
 * Theme handling for SSR/SSG-safe dark mode & custom color themes.
 *
 * - `'light' | 'dark'` pin a theme; `'system'` follows the OS preference.
 * - The choice is written to `document.documentElement[data-theme]`, which the
 *   `@lily-ui/css` layer reacts to. No component re-styling needed.
 * - SSR-safe: reads nothing from `window` during render; syncs on mount.
 * - To avoid a flash of the wrong theme, run {@link themeScript} in <head>.
 */
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContext {
  /** The user's selected mode (may be 'system'). */
  mode: Ref<ThemeMode>;
  /** The concrete theme currently applied. */
  resolvedTheme: ComputedRef<ResolvedTheme>;
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark (resolves 'system' first). */
  toggle: () => void;
}

const THEME_KEY: InjectionKey<ThemeContext> = Symbol('lily-theme');
const STORAGE_KEY = 'lily-theme';
const THEME_ATTR = 'data-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export interface ProvideThemeOptions {
  /** Initial mode before any stored preference is read. @default 'system' */
  defaultMode?: ThemeMode;
  /** Persist the user's choice to localStorage. @default true */
  enablePersistence?: boolean;
  /** localStorage key. @default 'lily-theme' */
  storageKey?: string;
}

/**
 * Create the theme context and `provide` it to descendants. Call from a root
 * component's `setup` (used internally by `ThemeProvider`).
 */
export function provideTheme(options: ProvideThemeOptions = {}): ThemeContext {
  const {
    defaultMode = 'system',
    enablePersistence = true,
    storageKey = STORAGE_KEY,
  } = options;

  const mode = ref<ThemeMode>(defaultMode);
  const systemTheme = ref<ResolvedTheme>('light');

  const resolvedTheme = computed<ResolvedTheme>(() =>
    mode.value === 'system' ? systemTheme.value : mode.value,
  );

  const setMode = (next: ThemeMode) => {
    mode.value = next;
    if (enablePersistence && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(storageKey, next);
    }
  };

  const toggle = () => setMode(resolvedTheme.value === 'dark' ? 'light' : 'dark');

  let mql: MediaQueryList | undefined;
  const onSystemChange = () => (systemTheme.value = getSystemTheme());

  onMounted(() => {
    // Hydrate stored preference after mount (avoids SSR mismatch). Guard
    // `localStorage` / `matchMedia`: absent in some minimal runtimes.
    if (enablePersistence && window.localStorage) {
      const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        mode.value = stored;
      }
    }
    systemTheme.value = getSystemTheme();
    if (!window.matchMedia) return;
    mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', onSystemChange);
  });

  onBeforeUnmount(() => mql?.removeEventListener('change', onSystemChange));

  // Reflect the resolved theme onto <html> for the CSS layer.
  watch(
    mode,
    (current) => {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      if (current === 'system') {
        root.removeAttribute(THEME_ATTR); // let CSS prefers-color-scheme drive it
      } else {
        root.setAttribute(THEME_ATTR, current);
      }
    },
    { immediate: true },
  );

  const ctx: ThemeContext = { mode, resolvedTheme, setMode, toggle };
  provide(THEME_KEY, ctx);
  return ctx;
}

/** Access the current theme. Throws if used outside a `<ThemeProvider>`. */
export function useTheme(): ThemeContext {
  const ctx = inject(THEME_KEY, null);
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>.');
  return ctx;
}

/**
 * Inline script body that applies the stored/OS theme *before* Vue hydrates,
 * preventing a flash of incorrect theme (FOUC). Inject the returned string into
 * a `<script>` in your document <head> (e.g. Nuxt `app.head`).
 *
 * @example
 * useHead({ script: [{ children: themeScript() }] })
 */
export function themeScript(storageKey: string = STORAGE_KEY): string {
  // Escape `<` so a key containing `</script>` cannot close the inline
  // <script> tag this string is injected into.
  const key = JSON.stringify(storageKey).replace(/</g, '\\u003c');
  return `(function(){try{var m=localStorage.getItem(${key});if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m);}}catch(e){}})();`;
}
