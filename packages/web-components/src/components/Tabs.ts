import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

export interface TabItem {
  /** Stable id for the tab. */
  id: string;
  /** Tab label. */
  label: string;
  /** Panel content. */
  content: string;
  /** Disable this tab. */
  disabled?: boolean;
}

const CLASS = 'lily-nav';

/**
 * `<lily-tabs>` — an accessible tabbed interface (WAI-ARIA tabs pattern).
 *
 * Arrow keys move between tabs (roving focus); Home/End jump to first/last.
 * Each panel is associated with its tab via `aria-labelledby`/`aria-controls`.
 * Tabs are provided as a JSON `items` attribute (shape
 * `{ id, label, content, disabled? }`). Dispatches a `change` event whose
 * `detail` is the active tab id.
 *
 * Attributes: `items`, `variant`, `label`.
 *
 * @example
 * ```html
 * <lily-tabs label="Settings" items='[{"id":"a","label":"A","content":"…"}]'></lily-tabs>
 * ```
 */
export class LilyTabs extends LilyElement {
  private baseId = uid();
  private active: string | null = null;
  // Tab buttons from the latest render, keyed by tab id.
  private tabEls = new Map<string, HTMLButtonElement>();
  // When true, the next rerender moves DOM focus to the active tab: `setActive`
  // rebuilds the DOM, so focusing must target the *new* button after `update()`
  // (same pattern as DatePicker's grid refocus).
  private focusActiveTab = false;

  static get observedAttributes(): string[] {
    return ['items', 'variant', 'label'];
  }

  private parseItems(): TabItem[] {
    const raw = this.attr('items');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as TabItem[]) : [];
    } catch {
      return [];
    }
  }

  private setActive(id: string): void {
    if (this.active === id) return;
    this.active = id;
    this.focusActiveTab = true;
    // Rerender (which restores focus in `update()`) *before* dispatching:
    // a change handler that synchronously mutates an observed attribute
    // triggers another rebuild, and focus restoration must already be done.
    this.rerender();
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: id }));
  }

  /** Move DOM focus to the active tab after a selection-triggered rerender. */
  protected update(): void {
    // If focus is on one of our tabs, the rebuild is about to detach it —
    // re-focus the active tab afterwards (covers attribute-triggered rebuilds
    // from change handlers, not just `setActive`).
    const activeEl = document.activeElement;
    const shouldFocus =
      this.focusActiveTab ||
      (activeEl instanceof HTMLElement &&
        this.contains(activeEl) &&
        activeEl.getAttribute('role') === 'tab');
    super.update();
    this.focusActiveTab = false;
    if (shouldFocus && this.active !== null) this.tabEls.get(this.active)?.focus();
  }

  protected build(): BuildResult {
    const items = this.parseItems();
    const variant = this.attr('variant', 'tabs');
    const label = this.attr('label');

    // Default to the first tab when no selection has been made yet, and fall
    // back to the first enabled tab when an `items` swap removed the active id
    // (otherwise every tab keeps tabindex="-1" and the tablist is unreachable).
    if (this.active === null || !items.some((t) => t.id === this.active)) {
      this.active = items.find((t) => !t.disabled)?.id ?? items[0]?.id ?? null;
    }
    const active = this.active;

    const enabled = items.filter((t) => !t.disabled);
    this.tabEls = new Map<string, HTMLButtonElement>();

    const root = h('div', {});

    const tablist = h('div', {
      class: [CLASS, `${CLASS}--${variant}`],
      attrs: { role: 'tablist', 'aria-label': label ?? null },
    });

    const onKeyDown = (e: KeyboardEvent, currentId: string) => {
      const idx = enabled.findIndex((t) => t.id === currentId);
      if (idx === -1) return;
      let nextIdx: number | null = null;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIdx = (idx + 1) % enabled.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIdx = (idx - 1 + enabled.length) % enabled.length;
          break;
        case 'Home':
          nextIdx = 0;
          break;
        case 'End':
          nextIdx = enabled.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      const next = enabled[nextIdx];
      // `setActive` rerenders and then focuses the freshly-built tab button in
      // `update()`; focusing the captured (now detached) button here would drop
      // focus to <body>.
      if (next) this.setActive(next.id);
    };

    for (const tab of items) {
      const selected = tab.id === active;
      const btn = h('button', {
        class: `${CLASS}__link`,
        attrs: {
          type: 'button',
          role: 'tab',
          id: `${this.baseId}-${tab.id}-tab`,
          'aria-selected': selected ? 'true' : 'false',
          'aria-controls': `${this.baseId}-${tab.id}-panel`,
          'aria-disabled': tab.disabled ? 'true' : null,
          tabindex: selected ? 0 : -1,
          disabled: tab.disabled ? '' : null,
        },
        text: tab.label,
      });
      btn.addEventListener('click', () => {
        if (!tab.disabled) this.setActive(tab.id);
      });
      btn.addEventListener('keydown', (e) => onKeyDown(e, tab.id));
      this.tabEls.set(tab.id, btn);
      tablist.appendChild(btn);
    }
    root.appendChild(tablist);

    for (const tab of items) {
      const panel = h('div', {
        class: 'lily-tab-panel',
        attrs: {
          role: 'tabpanel',
          id: `${this.baseId}-${tab.id}-panel`,
          'aria-labelledby': `${this.baseId}-${tab.id}-tab`,
          hidden: tab.id !== active ? '' : null,
          tabindex: 0,
        },
        text: tab.content,
      });
      root.appendChild(panel);
    }

    // Data-driven: no authored children are slotted.
    return { root, slot: null };
  }
}
