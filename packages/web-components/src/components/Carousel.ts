import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

const CLASS = 'lily-carousel';

/**
 * `<lily-carousel>` — a slideshow for cycling through items.
 *
 * Uses `aria-roledescription="carousel"`, labeled slides, and pauses
 * auto-advance on hover/focus. Respect users' reduced-motion preference by
 * leaving `interval` at 0 unless motion is wanted. Slides are provided as a JSON
 * `slides` attribute (an array of HTML strings). Dispatches a `change` event
 * whose `detail` is the active slide index.
 *
 * **Security:** each `slides` entry is injected verbatim via `innerHTML`. Pass
 * only HTML you trust (your own markup); never forward user input unsanitized,
 * or it becomes an XSS vector.
 *
 * Attributes: `slides`, `index`, `interval`, `controls`, `indicators`, `label`.
 *
 * @example
 * ```html
 * <lily-carousel interval="5000" slides='["<img src=\"a.jpg\">","<img src=\"b.jpg\">"]'></lily-carousel>
 * ```
 */
export class LilyCarousel extends LilyElement {
  private baseId = uid();
  private active = 0;
  private activeInit = false;
  private paused = false;
  private timer: ReturnType<typeof setInterval> | undefined;
  // Parsed `slides` cache, invalidated only when the raw attribute changes —
  // the JSON is not re-parsed on every render or slide change.
  private slidesRaw: string | null | undefined = undefined;
  private slidesCache: string[] = [];
  // Live references into the built DOM so slide changes can patch in place
  // (transform / aria attributes) instead of rebuilding via innerHTML — which
  // would kill the CSS transition and make images flicker.
  private viewportEl: HTMLElement | null = null;
  private slideEls: HTMLElement[] = [];
  private indicatorEls: HTMLButtonElement[] = [];

  static get observedAttributes(): string[] {
    return ['slides', 'index', 'interval', 'controls', 'indicators', 'label'];
  }

  private parseSlides(): string[] {
    const raw = this.getAttribute('slides');
    if (raw !== this.slidesRaw) {
      this.slidesRaw = raw;
      if (!raw) {
        this.slidesCache = [];
      } else {
        try {
          const parsed = JSON.parse(raw);
          this.slidesCache = Array.isArray(parsed) ? (parsed as string[]) : [];
        } catch {
          this.slidesCache = [];
        }
      }
    }
    return this.slidesCache;
  }

  private setActive(next: number): void {
    if (this.active === next) return;
    this.active = next;
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: next }));
    // Patch the existing DOM in place; do *not* rerender (see field docs).
    this.applyActive();
  }

  /** Sync transform + ARIA state for the current `active` index in place. */
  private applyActive(): void {
    const active = this.active;
    if (this.viewportEl) {
      this.viewportEl.style.transform = `translateX(-${active * 100}%)`;
    }
    this.slideEls.forEach((el, i) => {
      if (i !== active) el.setAttribute('aria-hidden', 'true');
      else el.removeAttribute('aria-hidden');
    });
    this.indicatorEls.forEach((el, i) => {
      if (i === active) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
  }

  private go(next: number, count: number): void {
    if (count <= 0) return;
    this.setActive((next + count) % count);
  }

  /** Clamp a slide index into `[0, count - 1]` for the current slides. */
  private clampIndex(index: number): number {
    const count = this.parseSlides().length;
    return Math.max(0, Math.min(Math.max(0, count - 1), index));
  }

  private restartTimer(): void {
    this.clearTimer();
    // Only auto-advance while in the document: an attribute change on a
    // disconnected element must not start an interval (connectedCallback
    // starts it on insertion).
    if (!this.isConnected) return;
    const interval = this.numAttr('interval', 0);
    const count = this.parseSlides().length;
    if (interval <= 0 || count <= 1) return;
    // Auto-advance, referencing the latest active index without resetting the
    // timer on every slide change.
    this.timer = setInterval(() => {
      if (!this.paused) this.go(this.active + 1, count);
    }, interval);
  }

  private clearTimer(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.restartTimer();
  }

  attributeChangedCallback(name: string, oldValue?: string | null, newValue?: string | null): void {
    // A controlled `index` change only moves the active slide: patch in place
    // (the DOM is built once; rebuilding would restart images/transitions).
    if (name === 'index' && this.activeInit && this.viewportEl) {
      // Clamp the controlled index into [0, count - 1].
      const next = this.clampIndex(this.numAttr('index', this.active));
      if (next !== this.active) {
        this.active = next;
        this.applyActive();
      }
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'interval' || name === 'slides') this.restartTimer();
  }

  disconnectedCallback(): void {
    this.clearTimer();
  }

  protected build(): BuildResult {
    const slides = this.parseSlides();
    const count = slides.length;
    const controls = this.attr('controls', 'true') !== 'false';
    const indicators = this.attr('indicators', 'true') !== 'false';
    const label = this.attr('label', 'Carousel');

    // Honor a controlled `index` attribute; otherwise keep internal state.
    if (!this.activeInit) {
      this.active = this.numAttr('index', 0);
      this.activeInit = true;
    } else if (this.getAttribute('index') !== null) {
      this.active = this.numAttr('index', this.active);
    }
    // Clamp into the current slide range — covers both an out-of-range
    // controlled `index` and a `slides` array that shrank below `active`.
    this.active = this.clampIndex(this.active);
    const active = this.active;

    const root = h('div', {
      class: CLASS,
      attrs: {
        role: 'group',
        'aria-roledescription': 'carousel',
        'aria-label': label ?? null,
      },
    });
    root.addEventListener('mouseenter', () => (this.paused = true));
    root.addEventListener('mouseleave', () => (this.paused = false));
    root.addEventListener('focusin', () => (this.paused = true));
    root.addEventListener('focusout', () => (this.paused = false));

    const viewport = h('div', { class: `${CLASS}__viewport` });
    viewport.style.transform = `translateX(-${active * 100}%)`;
    this.viewportEl = viewport;
    this.slideEls = slides.map((slide, i) => {
      const el = h('div', {
        class: `${CLASS}__slide`,
        attrs: {
          role: 'group',
          'aria-roledescription': 'slide',
          'aria-label': `${i + 1} of ${count}`,
          id: `${this.baseId}-slide-${i}`,
          'aria-hidden': i !== active ? 'true' : null,
        },
        html: slide,
      });
      viewport.appendChild(el);
      return el;
    });
    root.appendChild(viewport);

    if (controls && count > 1) {
      const prev = h('button', {
        class: `${CLASS}__control ${CLASS}__control--prev`,
        attrs: { type: 'button', 'aria-label': 'Previous slide' },
      });
      prev.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&lsaquo;' }));
      // Read `this.active` at click time: the controls are built once and must
      // keep working as the index changes without a rebuild.
      prev.addEventListener('click', () => this.go(this.active - 1, count));
      root.appendChild(prev);

      const next = h('button', {
        class: `${CLASS}__control ${CLASS}__control--next`,
        attrs: { type: 'button', 'aria-label': 'Next slide' },
      });
      next.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&rsaquo;' }));
      next.addEventListener('click', () => this.go(this.active + 1, count));
      root.appendChild(next);
    }

    this.indicatorEls = [];
    if (indicators && count > 1) {
      const list = h('ul', { class: `${CLASS}__indicators` });
      slides.forEach((_, i) => {
        const li = h('li');
        const dot = h('button', {
          class: `${CLASS}__indicator`,
          attrs: {
            type: 'button',
            'aria-label': `Go to slide ${i + 1}`,
            'aria-current': i === active ? 'true' : null,
          },
        });
        dot.addEventListener('click', () => this.setActive(i));
        li.appendChild(dot);
        list.appendChild(li);
        this.indicatorEls.push(dot);
      });
      root.appendChild(list);
    }

    // Data-driven: no authored children are slotted.
    return { root, slot: null };
  }
}
