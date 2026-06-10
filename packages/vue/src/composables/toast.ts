import { inject, provide, ref, type InjectionKey, type Ref } from 'vue';

/**
 * Toast notifications for Vue. {@link provideToast} creates the toast store and
 * provides it to descendants (called by `ToastProvider`); {@link useToast}
 * returns the `{ toast, dismiss }` API. Mirrors React's `ToastProvider` /
 * `useToast` contract.
 */
export type ToastStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info';
export type ToastPlacement = 'top-end' | 'bottom-end' | 'bottom-center';

export interface ToastOptions {
  /** Message content. */
  message: string;
  /** Semantic color. @default 'primary' */
  status?: ToastStatus;
  /**
   * Auto-dismiss after this many ms. `0` (the default) keeps the toast until the
   * user closes it — avoiding a time limit on reading (WCAG 2.1 AAA 2.2.3).
   * @default 0
   */
  duration?: number;
}

export interface ToastEntry {
  id: number;
  message: string;
  status: ToastStatus;
  duration: number;
}

export interface ToastContextValue {
  /** Reactive list of active toasts (consumed by `ToastProvider`). */
  toasts: Ref<ToastEntry[]>;
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => number;
  /** Dismiss a toast by id. */
  dismiss: (id: number) => void;
}

const TOAST_KEY: InjectionKey<ToastContextValue> = Symbol('lily-toast');

/**
 * Create the toast store and `provide` it to descendants. Used internally by
 * `ToastProvider`.
 */
export function provideToast(): ToastContextValue {
  const toasts = ref<ToastEntry[]>([]);
  let nextId = 0;

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const toast = (options: ToastOptions): number => {
    const id = nextId++;
    const entry: ToastEntry = {
      id,
      message: options.message,
      status: options.status ?? 'primary',
      duration: options.duration ?? 0,
    };
    toasts.value = [...toasts.value, entry];
    return id;
  };

  const ctx: ToastContextValue = { toasts, toast, dismiss };
  provide(TOAST_KEY, ctx);
  return ctx;
}

/** Access the toast API. Throws outside a `<ToastProvider>`. */
export function useToast(): Pick<ToastContextValue, 'toast' | 'dismiss'> {
  const ctx = inject(TOAST_KEY, null);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>.');
  return { toast: ctx.toast, dismiss: ctx.dismiss };
}
