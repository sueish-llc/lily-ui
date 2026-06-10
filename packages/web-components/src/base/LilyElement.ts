import { cx, type ClassValue } from '../utils/cx';

/**
 * Result of a custom element's {@link LilyElement.build} step.
 *
 * - `root` is the element that carries the Lily class name(s) and is inserted
 *   into the host.
 * - `slot` (optional) is the descendant that should receive the host's original
 *   light-DOM children. Defaults to `root` when omitted.
 */
export interface BuildResult {
  root: HTMLElement;
  slot?: HTMLElement | null;
}

/**
 * Base class for all Lily custom elements.
 *
 * **Light-DOM strategy.** Lily styles come from the global `@lily-ui/css` layer,
 * which targets plain class names and the `data-theme` / `data-density`
 * attributes on ancestors. Shadow DOM would wall those off, so Lily elements
 * render in the *light* DOM instead:
 *
 * - The host (`<lily-button>`) is set to `display: contents`, so it is
 *   transparent to layout — only its rendered child carries the box.
 * - {@link build} returns a real semantic element (e.g. a `<button>`) with the
 *   correct `lily-*` classes; the host's authored children are moved into the
 *   designated `slot`.
 * - The result is markup identical to the React/Vue output, fully styled by the
 *   shared CSS, with native semantics and event bubbling preserved.
 */
export abstract class LilyElement extends HTMLElement {
  /** The host's original authored child nodes (captured once, then re-homed). */
  private _slotted: Node[] | null = null;

  connectedCallback(): void {
    if (this._slotted === null) {
      this._slotted = Array.from(this.childNodes);
    }
    // Make the host transparent to layout; the rendered root owns the box.
    this.style.display = 'contents';
    this.update();
  }

  attributeChangedCallback(
    _name?: string,
    _oldValue?: string | null,
    _newValue?: string | null,
  ): void {
    // Ignore changes that fire before the first connect/capture.
    if (this._slotted !== null) this.update();
  }

  /**
   * Build the inner DOM for the current attribute state. Implementations create
   * elements and set classes/ARIA but should *not* insert the slotted children
   * themselves — the base class re-homes them into `slot` (or `root`).
   */
  protected abstract build(): BuildResult;

  /** Re-render: rebuild the tree and move the authored children into it. */
  protected update(): void {
    const { root, slot } = this.build();
    const target = slot ?? root;
    if (this._slotted) {
      for (const node of this._slotted) target.appendChild(node);
    }
    this.replaceChildren(root);
  }

  /** Force a re-render from subclasses (e.g. after internal state changes). */
  protected rerender(): void {
    if (this._slotted !== null) this.update();
  }

  // --- typed attribute helpers ---------------------------------------------

  /** Read a string attribute, or `fallback` when absent. */
  protected attr(name: string, fallback?: string): string | undefined {
    const v = this.getAttribute(name);
    return v === null ? fallback : v;
  }

  /** Read a boolean attribute by presence (`<el flag>` → `true`). */
  protected boolAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  /** Read a numeric attribute, or `fallback` when absent/invalid. */
  protected numAttr(name: string, fallback: number): number {
    const v = this.getAttribute(name);
    if (v === null) return fallback;
    const n = Number(v);
    return Number.isNaN(n) ? fallback : n;
  }

  /** Build a class string (re-exported {@link cx} for convenience). */
  protected cx(...args: ClassValue[]): string {
    return cx(...args);
  }

  /**
   * Copy the named attributes that are present on the host onto `target`. Used
   * by form controls to forward native attributes (`name`, `required`,
   * `placeholder`, `aria-*`, …) to the inner element they render.
   */
  protected forwardAttrs(target: HTMLElement, names: readonly string[]): void {
    for (const name of names) {
      const v = this.getAttribute(name);
      if (v !== null) target.setAttribute(name, v);
    }
  }
}

/**
 * Common native attributes a Lily form control forwards from its host to the
 * inner control element.
 */
export const FORM_CONTROL_ATTRS = [
  'id',
  'name',
  'value',
  'placeholder',
  'required',
  'disabled',
  'readonly',
  'min',
  'max',
  'step',
  'minlength',
  'maxlength',
  'pattern',
  'autocomplete',
  'inputmode',
  'aria-label',
  'aria-describedby',
  'aria-invalid',
] as const;

/** Create an element with classes, attributes, and (optionally) children/text. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    class?: ClassValue | ClassValue[];
    attrs?: Record<string, string | number | boolean | null | undefined>;
    text?: string;
    html?: string;
    children?: Node[];
  } = {},
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (options.class !== undefined) {
    const cls = Array.isArray(options.class) ? cx(...options.class) : cx(options.class);
    if (cls) el.className = cls;
  }
  if (options.attrs) {
    for (const [k, v] of Object.entries(options.attrs)) {
      if (v === null || v === undefined || v === false) continue;
      el.setAttribute(k, v === true ? '' : String(v));
    }
  }
  if (options.text !== undefined) el.textContent = options.text;
  if (options.html !== undefined) el.innerHTML = options.html;
  if (options.children) el.append(...options.children);
  return el;
}

let _uidCounter = 0;

/** Generate a process-unique id with an optional prefix (default `lily`). */
export function uid(prefix = 'lily'): string {
  return `${prefix}-${(_uidCounter++).toString(36)}`;
}

/** Register a custom element once (no-op if the tag is already defined). */
export function define(name: string, ctor: CustomElementConstructor): void {
  if (typeof customElements !== 'undefined' && !customElements.get(name)) {
    customElements.define(name, ctor);
  }
}
