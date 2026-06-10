import { LilyElement, h, type BuildResult } from '../base/LilyElement';

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

const REGION = 'lily-toast-region';
const CLASS = 'lily-toast';

interface ToastRecord {
  id: number;
  node: HTMLElement;
  timer: ReturnType<typeof setTimeout> | undefined;
}

/**
 * `<lily-toast-region>` — the live region that hosts toast notifications.
 *
 * Renders an `aria-live` region (`polite`, with each toast escalating to
 * `assertive` for danger/warning). Toasts are added imperatively via the
 * exported {@link toast} / {@link dismissToast} helpers, or via this element's
 * own `add()` / `dismiss()` methods.
 *
 * Attributes: `placement`.
 *
 * @example
 * ```html
 * <lily-toast-region placement="bottom-end"></lily-toast-region>
 * ```
 */
export class LilyToastRegion extends LilyElement {
  private nextId = 0;
  private records = new Map<number, ToastRecord>();
  private region: HTMLDivElement | null = null;

  static get observedAttributes(): string[] {
    return ['placement'];
  }

  protected build(): BuildResult {
    const placement = this.attr('placement', 'bottom-end');
    const region = h('div', {
      class: [REGION, `${REGION}--${placement}`],
      attrs: { role: 'region', 'aria-label': 'Notifications' },
    });
    // Preserve already-mounted toast nodes across re-renders (e.g. placement
    // changes) so live timers keep their DOM.
    for (const record of this.records.values()) region.appendChild(record.node);
    this.region = region;
    // Data-driven: no authored children are slotted.
    return { root: region, slot: null };
  }

  /** Show a toast; returns its id. */
  add(options: ToastOptions): number {
    const id = this.nextId++;
    const status = options.status ?? 'primary';
    const duration = options.duration ?? 0;
    const assertive = status === 'danger' || status === 'warning';

    const node = h('div', {
      class: CLASS,
      attrs: {
        'data-status': status,
        role: assertive ? 'alert' : 'status',
        'aria-live': assertive ? 'assertive' : 'polite',
      },
    });
    node.appendChild(h('div', { class: `${CLASS}__body`, text: options.message }));
    const close = h('button', {
      class: 'lily-close',
      attrs: { type: 'button', 'aria-label': 'Dismiss notification' },
    });
    close.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&times;' }));
    close.addEventListener('click', () => this.dismiss(id));
    node.appendChild(close);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (duration > 0) timer = setTimeout(() => this.dismiss(id), duration);

    this.records.set(id, { id, node, timer });
    (this.region ?? this).appendChild(node);
    return id;
  }

  /** Dismiss a toast by id. */
  dismiss(id: number): void {
    const record = this.records.get(id);
    if (!record) return;
    if (record.timer !== undefined) clearTimeout(record.timer);
    record.node.remove();
    this.records.delete(id);
  }

  disconnectedCallback(): void {
    for (const record of this.records.values()) {
      if (record.timer !== undefined) clearTimeout(record.timer);
    }
    this.records.clear();
  }
}

let singleton: LilyToastRegion | null = null;

/**
 * Lazily ensure a single `<lily-toast-region>` exists in `document.body`. The
 * region is created with the given placement the first time it is needed.
 */
function ensureRegion(placement: ToastPlacement = 'bottom-end'): LilyToastRegion {
  if (singleton && singleton.isConnected) return singleton;
  const existing = document.querySelector(REGION) as LilyToastRegion | null;
  if (existing) {
    singleton = existing;
    return existing;
  }
  const region = document.createElement(REGION) as LilyToastRegion;
  region.setAttribute('placement', placement);
  document.body.appendChild(region);
  singleton = region;
  return region;
}

/**
 * Show a toast from anywhere, lazily mounting a `<lily-toast-region>` in
 * `document.body` if one does not already exist. Returns the toast id.
 *
 * @example
 * ```ts
 * import { toast } from '@lily-ui/web-components';
 * toast({ message: 'Saved', status: 'success' });
 * ```
 */
export function toast(options: ToastOptions): number {
  return ensureRegion().add(options);
}

/** Dismiss a toast by id from anywhere. */
export function dismissToast(id: number): void {
  singleton?.dismiss(id);
}
