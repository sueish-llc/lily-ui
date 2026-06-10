import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-collapse>` — animates showing/hiding content by height.
 *
 * Set the `open` attribute to expand the content and remove it to collapse.
 * Pair the toggling control with `aria-expanded` and `aria-controls` pointing
 * at this element's `id`.
 *
 * Attributes: `open`.
 *
 * @example
 * ```html
 * <button aria-expanded="false" aria-controls="c1" onclick="...">Toggle</button>
 * <lily-collapse id="c1">content</lily-collapse>
 * ```
 */
export class LilyCollapse extends LilyElement {
  static get observedAttributes(): string[] {
    return ['open'];
  }

  /** Animated height in pixels; `undefined` means height:auto (fully open). */
  private _height: number | undefined = undefined;

  /** Whether the element is fully hidden (display:none equivalent via `hidden`). */
  private _hidden = true;

  /** Pending setTimeout id for auto-height release after expand. */
  private _timer: ReturnType<typeof setTimeout> | null = null;

  connectedCallback(): void {
    // Initialise state from the `open` attribute before first render.
    const isOpen = this.boolAttr('open');
    this._height = isOpen ? undefined : 0;
    this._hidden = !isOpen;
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'open') {
      const open = newValue !== null;
      // Run the animation; it calls rerender() internally — do not also call
      // super which would trigger a redundant immediate rebuild.
      this._runAnimation(open);
    } else {
      super.attributeChangedCallback();
    }
  }

  private _runAnimation(open: boolean): void {
    // Find the rendered root (the lily-collapse div) if it exists.
    const el = this.firstElementChild as HTMLElement | null;
    if (!el) return;

    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    if (open) {
      // Expand: animate to content height, then release to auto.
      this._hidden = false;
      this._height = el.scrollHeight;
      this.rerender();
      this._timer = setTimeout(() => {
        this._timer = null;
        this._height = undefined;
        this.rerender();
      }, 220);
    } else {
      // Collapse: pin to current height first, then next frame animate to 0.
      this._height = el.scrollHeight;
      this.rerender();
      requestAnimationFrame(() => {
        this._height = 0;
        this.rerender();
        // Hide once the transition ends (~220 ms matches the CSS transition).
        this._timer = setTimeout(() => {
          this._timer = null;
          this._hidden = true;
          this.rerender();
        }, 220);
      });
    }
  }

  protected build(): BuildResult {
    const CLASS = 'lily-collapse';

    const root = h('div', { class: CLASS });

    // Apply animated height style.
    if (this._height !== undefined) {
      root.style.height = `${this._height}px`;
    }

    // Mirror React: hidden when !open && height === 0.
    if (this._hidden) {
      root.setAttribute('hidden', '');
    }

    return { root };
  }
}
