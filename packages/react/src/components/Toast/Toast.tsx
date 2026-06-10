import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { CloseButton } from '../CloseButton';

export type ToastStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info';
export type ToastPlacement = 'top-end' | 'bottom-end' | 'bottom-center';

export interface ToastOptions {
  /** Message content. */
  message: ReactNode;
  /** Semantic color. @default 'primary' */
  status?: ToastStatus;
  /**
   * Auto-dismiss after this many ms. `0` (the default) keeps the toast until the
   * user closes it — this avoids a time limit on reading (WCAG 2.1 AAA 2.2.3).
   * Set a positive value only when the message is non-essential.
   * @default 0
   */
  duration?: number;
}

interface ToastEntry extends Required<Omit<ToastOptions, 'duration'>> {
  id: number;
  duration: number;
}

interface ToastContextValue {
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => number;
  /** Dismiss a toast by id. */
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Access the toast API. Throws outside a {@link ToastProvider}. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>.');
  return ctx;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Where toasts appear. @default 'bottom-end' */
  placement?: ToastPlacement;
}

const REGION = 'lily-toast-region';
const CLASS = 'lily-toast';

/**
 * ToastProvider — renders a live region and exposes {@link useToast}.
 *
 * Toasts are announced via an `aria-live` region (`polite`, or `assertive` for
 * danger). Wrap your app once.
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * // elsewhere: const { toast } = useToast(); toast({ message: 'Saved' });
 * ```
 */
export function ToastProvider({ children, placement = 'bottom-end' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const nextId = useRef(0);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    const entry: ToastEntry = {
      id,
      message: options.message,
      status: options.status ?? 'primary',
      duration: options.duration ?? 0,
    };
    setToasts((prev) => [...prev, entry]);
    return id;
  }, []);

  // Stable context value: `toast` / `dismiss` are stable useCallbacks, so
  // consumers don't re-render every time the provider re-renders.
  const contextValue = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted &&
        createPortal(
          <div
            className={cx(REGION, `${REGION}--${placement}`)}
            role="region"
            aria-label="Notifications"
          >
            {toasts.map((t) => (
              <ToastItem key={t.id} entry={t} onDismiss={dismiss} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

function ToastItem({ entry, onDismiss }: { entry: ToastEntry; onDismiss: (id: number) => void }) {
  // `onDismiss` (the provider's `dismiss`) is a stable useCallback, and
  // `entry.id` / `entry.duration` never change for a given toast, so this
  // effect runs exactly once per toast: the auto-dismiss timer is not reset
  // when the provider re-renders (e.g. when another toast is added).
  useEffect(() => {
    if (entry.duration <= 0) return;
    const t = setTimeout(() => onDismiss(entry.id), entry.duration);
    return () => clearTimeout(t);
  }, [entry.id, entry.duration, onDismiss]);

  const assertive = entry.status === 'danger' || entry.status === 'warning';

  return (
    <div
      className={CLASS}
      data-status={entry.status}
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
    >
      <div className={`${CLASS}__body`}>{entry.message}</div>
      <CloseButton onClick={() => onDismiss(entry.id)} label="Dismiss notification" />
    </div>
  );
}
