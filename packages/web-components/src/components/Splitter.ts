import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-splitter>` — two resizable panes with a draggable, keyboard-operable
 * divider. The first two element children become the start / end panes.
 * Dispatches a `change` event whose `detail` is the start-pane percent.
 *
 * Attributes: `orientation`, `size`, `min`, `max`, `step`, `handle-label`.
 */
export class LilySplitter extends LilyElement {
  private captured: Element[] | null = null;
  private value = 50;
  private initialized = false;
  /** Tears down the in-flight drag's window listeners (and pending frame). */
  private dragCleanup: (() => void) | null = null;
  // Live references into the built DOM so attribute changes (notably a
  // controlled `size` echo during a drag) patch flex-basis / ARIA in place
  // instead of rebuilding — a rebuild would detach the measured root mid-drag
  // (getBoundingClientRect() → 0 → Infinity) and drop handle focus.
  private rootEl: HTMLElement | null = null;
  private handleEl: HTMLElement | null = null;

  static get observedAttributes(): string[] {
    return ['orientation', 'size', 'min', 'max', 'step', 'handle-label'];
  }

  connectedCallback(): void {
    if (this.captured === null) this.captured = Array.from(this.children);
    this.style.display = 'contents';
    this.render2();
  }

  disconnectedCallback(): void {
    this.dragCleanup?.();
    this.dragCleanup = null;
  }

  attributeChangedCallback(name?: string): void {
    if (this.captured === null) return;
    if (name === 'size') this.value = this.numAttr('size', this.value);
    if (!this.initialized || this.rootEl === null) {
      this.render2();
      return;
    }
    // Orientation changes the structure-level bits (modifier class, drag axis);
    // everything else is patched onto the existing DOM.
    if (name === 'orientation') this.render2();
    else this.applyState();
  }

  // Unused: this element fully manages its own rendering (two-pane distribution).
  protected build(): BuildResult {
    return { root: h('div') };
  }

  // --- live attribute reads (drag/key handlers must not capture stale values) -

  private get vertical(): boolean {
    return this.attr('orientation') === 'vertical';
  }

  private get min(): number {
    return this.numAttr('min', 10);
  }

  private get max(): number {
    return this.numAttr('max', 90);
  }

  private clampValue(n: number): number {
    return Math.max(this.min, Math.min(this.max, n));
  }

  /** Sync the pane size and the handle's ARIA values onto the existing DOM. */
  private applyState(): void {
    const { rootEl, handleEl } = this;
    if (!rootEl || !handleEl) return;
    rootEl.style.setProperty('--lily-splitter-size', `${this.value}%`);
    handleEl.setAttribute('aria-orientation', this.vertical ? 'horizontal' : 'vertical');
    handleEl.setAttribute('aria-label', this.attr('handle-label', 'Resize panels')!);
    handleEl.setAttribute('aria-valuenow', String(Math.round(this.value)));
    handleEl.setAttribute('aria-valuemin', String(this.min));
    handleEl.setAttribute('aria-valuemax', String(this.max));
  }

  /** Clamp + apply a new size in place, then emit `change`. */
  private apply(n: number): void {
    this.value = this.clampValue(n);
    this.applyState();
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: this.value }));
  }

  private render2(): void {
    if (!this.initialized) {
      this.value = this.numAttr('size', 50);
      this.initialized = true;
    }
    const vertical = this.vertical;

    const root = h('div', { class: ['lily-splitter', vertical && 'lily-splitter--vertical'] });

    const startPanel = h('div', { class: 'lily-splitter__panel lily-splitter__panel--start' });
    const endPanel = h('div', { class: 'lily-splitter__panel lily-splitter__panel--end' });
    if (this.captured?.[0]) startPanel.appendChild(this.captured[0]);
    if (this.captured?.[1]) endPanel.appendChild(this.captured[1]);

    // Focusable window-splitter (WAI-ARIA): a separator `<div>` operable by
    // pointer + arrow keys — identical markup to the React source of truth.
    const handle = h('div', {
      class: 'lily-splitter__handle',
      attrs: {
        role: 'separator',
        tabindex: 0,
      },
    });

    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      // Only one drag at a time; clear a previous one that never ended.
      this.dragCleanup?.();
      let frame: number | null = null;
      let lastEvent: PointerEvent | null = null;
      // Batch the layout read (getBoundingClientRect) + write into one frame
      // instead of thrashing on every pointermove.
      const flush = () => {
        const ev = lastEvent;
        lastEvent = null;
        const rect = this.rootEl?.getBoundingClientRect();
        if (!ev || !rect) return;
        // A detached root (e.g. `stop()` running from disconnectedCallback)
        // measures 0×0; flushing against it would compute NaN/Infinity.
        // Discard the pending move instead.
        const span = this.vertical ? rect.height : rect.width;
        if (span === 0) return;
        const pct = this.vertical
          ? ((ev.clientY - rect.top) / span) * 100
          : ((ev.clientX - rect.left) / span) * 100;
        this.apply(Math.round(pct));
      };
      const move = (ev: PointerEvent) => {
        lastEvent = ev;
        if (frame !== null) return;
        frame = requestAnimationFrame(() => {
          frame = null;
          flush();
        });
      };
      const stop = () => {
        if (frame !== null) {
          cancelAnimationFrame(frame);
          frame = null;
        }
        // Apply the final pointermove instead of discarding it with the frame.
        flush();
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', stop);
        window.removeEventListener('pointercancel', stop);
        this.dragCleanup = null;
      };
      this.dragCleanup = stop;
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', stop);
      window.addEventListener('pointercancel', stop);
    });
    handle.addEventListener('keydown', (e) => {
      const vert = this.vertical;
      const step = this.numAttr('step', 5);
      const dec = vert ? 'ArrowUp' : 'ArrowLeft';
      const inc = vert ? 'ArrowDown' : 'ArrowRight';
      if (e.key === dec) {
        e.preventDefault();
        this.apply(this.value - step);
      } else if (e.key === inc) {
        e.preventDefault();
        this.apply(this.value + step);
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.apply(this.min);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.apply(this.max);
      }
    });

    root.append(startPanel, handle, endPanel);
    // Preserve handle focus across a full rebuild (e.g. orientation change).
    const hadFocus = this.handleEl !== null && document.activeElement === this.handleEl;
    this.rootEl = root;
    this.handleEl = handle;
    this.applyState();
    this.replaceChildren(root);
    if (hadFocus) handle.focus();
  }
}
