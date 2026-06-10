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
 * Motion tier ("performance / quality" axis), independent of the a11y axis
 * (`prefers-reduced-motion`). The tier is reflected on `<html data-motion>` so
 * the `@lily-ui/css` layer degrades instantly; presence/animate helpers read the
 * same signals so visuals and behavior stay in lock-step.
 */
export const MOTION_ATTR = 'data-motion';

/** The concrete tiers the CSS layer understands. */
export type MotionLevel = 'full' | 'minimal' | 'none';
/** The tier plus `'auto'`, which resolves from device/OS signals. */
export type MotionPreference = MotionLevel | 'auto';

/** Whether the OS requests reduced motion (the accessibility axis). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Resolve `'auto'` to a concrete tier from OS + device capability signals. */
export function detectMotionLevel(): MotionLevel {
  if (typeof window === 'undefined') return 'full';
  if (prefersReducedMotion()) return 'none';

  const nav = window.navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return 'minimal';
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return 'minimal';
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return 'minimal';

  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const small = window.matchMedia?.('(max-width: 640px)').matches;
  if (coarse && small) return 'minimal';

  return 'full';
}

/** Resolve a preference (possibly `'auto'`) to the concrete tier to apply. */
export function resolveMotionLevel(preference: MotionPreference): MotionLevel {
  return preference === 'auto' ? detectMotionLevel() : preference;
}

/**
 * Whether JS-driven exit animations should be skipped entirely. True when motion
 * is effectively off — OS reduced-motion, or the `data-motion="none"` tier.
 */
export function shouldSkipMotion(): boolean {
  if (prefersReducedMotion()) return true;
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute(MOTION_ATTR) === 'none';
}

export interface MotionContext {
  /** The user's selected preference (may be `'auto'`). */
  preference: Ref<MotionPreference>;
  /** The concrete tier currently applied. */
  level: ComputedRef<MotionLevel>;
  setPreference: (preference: MotionPreference) => void;
}

const MOTION_KEY: InjectionKey<MotionContext> = Symbol('lily-motion');
const STORAGE_KEY = 'lily-motion';

export interface ProvideMotionOptions {
  /** Initial preference before any stored value is read. @default 'auto' */
  defaultPreference?: MotionPreference;
  /** Persist the user's choice to localStorage. @default true */
  enablePersistence?: boolean;
  /** localStorage key. @default 'lily-motion' */
  storageKey?: string;
}

/**
 * Create the motion context and `provide` it to descendants. Call from a root
 * component's `setup` (used internally by `MotionProvider`).
 */
export function provideMotion(options: ProvideMotionOptions = {}): MotionContext {
  const {
    defaultPreference = 'auto',
    enablePersistence = true,
    storageKey = STORAGE_KEY,
  } = options;

  const preference = ref<MotionPreference>(defaultPreference);
  const autoLevel = ref<MotionLevel>('full');

  const level = computed<MotionLevel>(() =>
    preference.value === 'auto' ? autoLevel.value : preference.value,
  );

  const setPreference = (next: MotionPreference) => {
    preference.value = next;
    if (enablePersistence && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(storageKey, next);
    }
  };

  let mql: MediaQueryList | undefined;
  const onChange = () => (autoLevel.value = detectMotionLevel());

  onMounted(() => {
    if (enablePersistence && typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(storageKey) as MotionPreference | null;
      if (stored === 'auto' || stored === 'full' || stored === 'minimal' || stored === 'none') {
        preference.value = stored;
      }
    }
    autoLevel.value = detectMotionLevel();
    if (window.matchMedia) {
      mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      mql.addEventListener('change', onChange);
    }
  });

  onBeforeUnmount(() => mql?.removeEventListener('change', onChange));

  // Reflect the resolved tier onto <html> for the CSS layer.
  watch(
    level,
    (current) => {
      if (typeof document === 'undefined') return;
      document.documentElement.setAttribute(MOTION_ATTR, current);
    },
    { immediate: true },
  );

  const ctx: MotionContext = { preference, level, setPreference };
  provide(MOTION_KEY, ctx);
  return ctx;
}

/**
 * Access the current motion tier. Returns a read-only fallback when used outside
 * a `<MotionProvider>`, so leaf helpers never require the provider.
 */
export function useMotionLevel(): MotionContext {
  const ctx = inject(MOTION_KEY, null);
  if (ctx) return ctx;
  const preference = ref<MotionPreference>('auto');
  const level = computed<MotionLevel>(() => resolveMotionLevel('auto'));
  return { preference, level, setPreference: () => {} };
}

/**
 * Inline script body that applies the stored motion tier *before* Vue hydrates,
 * preventing a flash of full-motion. Inject into a `<script>` in the document
 * <head> (e.g. Nuxt `app.head`).
 */
export function motionScript(storageKey: string = STORAGE_KEY): string {
  // Escape `<` so a key containing `</script>` cannot close the inline
  // <script> tag this string is injected into.
  const key = JSON.stringify(storageKey).replace(/</g, '\\u003c');
  return `(function(){try{var p=localStorage.getItem(${key})||'auto';var l=p;if(p==='auto'){l=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'none':'full';}document.documentElement.setAttribute('data-motion',l);}catch(e){}})();`;
}
