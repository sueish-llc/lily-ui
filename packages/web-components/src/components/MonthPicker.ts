import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';
import { getDateTimeFormat, toPlainYearMonth, toUTCDate, type PlainYearMonthInput } from '../utils/datetime';

const CLASS = 'lily-month-picker';

// --- Pure helpers (Temporal) -----------------------------------------------

/** Clamp `ym` into the inclusive `[min, max]` range. */
function clamp(
  ym: Temporal.PlainYearMonth,
  min: Temporal.PlainYearMonth | undefined,
  max: Temporal.PlainYearMonth | undefined,
): Temporal.PlainYearMonth {
  if (min && Temporal.PlainYearMonth.compare(ym, min) < 0) return min;
  if (max && Temporal.PlainYearMonth.compare(ym, max) > 0) return max;
  return ym;
}

/** Localized month label via a fixed-UTC `Date`; the logic stays in Temporal. */
function formatMonth(
  ym: Temporal.PlainYearMonth,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  // Formatters are cached per locale + options (a render asks for ~14 labels).
  // `toUTCDate` keeps years 0-99 intact (Date.UTC would map them to 1900-99).
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(
    toUTCDate(ym.toPlainDate({ day: 1 })),
  );
}

function toBound(input: PlainYearMonthInput | undefined): Temporal.PlainYearMonth | undefined {
  return input == null ? undefined : toPlainYearMonth(input);
}

function nowYm(): Temporal.PlainYearMonth {
  return Temporal.Now.plainDateISO().toPlainYearMonth();
}

// --- Inline icons (no external assets; inherit currentColor) ----------------

const CALENDAR_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
  '<rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.7"></rect>' +
  '<path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>' +
  '</svg>';

function chevronIcon(dir: 'left' | 'right'): string {
  const d = dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7';
  return (
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    `<path d="${d}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>` +
    '</svg>'
  );
}

/**
 * `<lily-month-picker>` — pick a calendar month from a 12-month grid with
 * prev/next year navigation.
 *
 * Grid keyboard model (focus inside the panel):
 * - Arrow keys move by one / three months, `Home`/`End` to row edges
 * - `PageUp`/`PageDown` move by year
 * - `Enter`/`Space` selects, `Escape` closes
 *
 * Attributes: `value` (ISO `YYYY-MM`), `min`, `max`, `locale`, `disabled`,
 * `size`, `align-end`, `toggle-label`, `id`. Dispatches a `change` event whose
 * `detail` is the new ISO `YYYY-MM` string.
 *
 * @example
 * ```html
 * <lily-month-picker value="2026-05"></lily-month-picker>
 * ```
 */
export class LilyMonthPicker extends LilyElement {
  private reactId = uid();
  private open = false;
  private selected: Temporal.PlainYearMonth | null = null;
  private viewYear = nowYm().year;
  private focused: Temporal.PlainYearMonth = nowYm();
  private focusCell = false;
  // Whether the `value` attribute was (re)set since the last sync — every
  // attribute write resyncs, even re-setting the same string to revert an
  // ignored `change` (TimePicker's dirty-flag pattern).
  private valueAttrDirty = false;
  private seeded = false;

  private dismissCleanup: (() => void) | null = null;
  private escapeCleanup: (() => void) | null = null;
  private toggleEl: HTMLButtonElement | null = null;
  private gridEl: HTMLElement | null = null;

  static get observedAttributes(): string[] {
    return ['value', 'min', 'max', 'locale', 'disabled', 'size', 'align-end', 'toggle-label', 'id'];
  }

  private get minYm(): Temporal.PlainYearMonth | undefined {
    return toBound(this.attr('min'));
  }
  private get maxYm(): Temporal.PlainYearMonth | undefined {
    return toBound(this.attr('max'));
  }
  private get locale(): Intl.LocalesArgument {
    return this.attr('locale');
  }
  private get baseId(): string {
    return this.attr('id') ?? this.reactId;
  }

  attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    // `setAttribute` fires this even when the value is unchanged, which is how
    // a host reverts an ignored `change` (string comparison alone misses it).
    if (name === 'value') this.valueAttrDirty = true;
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private syncFromValue(): void {
    const raw = this.getAttribute('value');
    const iso = raw == null || raw.trim() === '' ? '' : raw;

    if (!this.seeded) {
      this.selected = iso ? safeParse(iso) : null;
      const start = this.selected ?? clamp(nowYm(), this.minYm, this.maxYm);
      this.focused = start;
      this.viewYear = start.year;
      this.valueAttrDirty = false;
      this.seeded = true;
      return;
    }

    if (this.valueAttrDirty) {
      this.valueAttrDirty = false;
      const parsed = iso ? safeParse(iso) : null;
      const same =
        parsed === null ? this.selected === null : this.selected !== null && parsed.equals(this.selected);
      if (!same) this.selected = parsed;
    }
  }

  private isSelectable(ym: Temporal.PlainYearMonth): boolean {
    const { minYm, maxYm } = this;
    if (minYm && Temporal.PlainYearMonth.compare(ym, minYm) < 0) return false;
    if (maxYm && Temporal.PlainYearMonth.compare(ym, maxYm) > 0) return false;
    return true;
  }

  private clampToBounds(ym: Temporal.PlainYearMonth): Temporal.PlainYearMonth {
    return clamp(ym, this.minYm, this.maxYm);
  }

  private moveFocus(ym: Temporal.PlainYearMonth): void {
    const next = this.clampToBounds(ym);
    this.focusCell = true;
    this.focused = next;
    this.viewYear = next.year;
    this.rerender();
  }

  private openPopup(): void {
    if (this.boolAttr('disabled')) return;
    const start = this.clampToBounds(this.selected ?? nowYm());
    this.focusCell = true;
    this.focused = start;
    this.viewYear = start.year;
    this.open = true;
    this.rerender();
  }

  private closePopup(returnFocus: boolean): void {
    this.open = false;
    this.rerender();
    if (returnFocus) this.toggleEl?.focus();
  }

  private selectMonth(ym: Temporal.PlainYearMonth): void {
    if (!this.isSelectable(ym)) return;
    const prevIso = this.selected ? this.selected.toString() : null;
    const nextIso = ym.toString();
    this.selected = ym;
    this.focused = ym;
    if (prevIso !== nextIso) {
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: nextIso }));
    }
    this.closePopup(true);
  }

  private onGridKeyDown(e: KeyboardEvent): void {
    const f = this.focused;
    switch (e.key) {
      case 'ArrowLeft':
        this.moveFocus(f.subtract({ months: 1 }));
        break;
      case 'ArrowRight':
        this.moveFocus(f.add({ months: 1 }));
        break;
      case 'ArrowUp':
        this.moveFocus(f.subtract({ months: 3 }));
        break;
      case 'ArrowDown':
        this.moveFocus(f.add({ months: 3 }));
        break;
      case 'Home':
        this.moveFocus(f.subtract({ months: (f.month - 1) % 3 }));
        break;
      case 'End':
        this.moveFocus(f.add({ months: 2 - ((f.month - 1) % 3) }));
        break;
      case 'PageUp':
        this.moveFocus(f.subtract({ years: 1 }));
        break;
      case 'PageDown':
        this.moveFocus(f.add({ years: 1 }));
        break;
      case 'Enter':
      case ' ':
        this.selectMonth(f);
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  protected build(): BuildResult {
    this.syncFromValue();

    const disabled = this.boolAttr('disabled');
    const alignEnd = this.boolAttr('align-end');
    const size = this.attr('size', 'md')!;
    const toggleLabel = this.attr('toggle-label', 'Choose month')!;
    const baseId = this.baseId;
    const popupId = `${baseId}-popup`;
    const titleId = `${baseId}-title`;
    const { open, locale } = this;

    const root = h('div', {
      class: [CLASS, `${CLASS}--${size}`, disabled && `${CLASS}--disabled`],
    });

    const triggerText = this.selected
      ? formatMonth(this.selected, locale, { year: 'numeric', month: 'long' })
      : toggleLabel;

    const trigger = h('button', {
      class: `${CLASS}__trigger`,
      attrs: {
        type: 'button',
        id: baseId,
        'aria-haspopup': 'dialog',
        'aria-expanded': open ? 'true' : 'false',
        'aria-controls': open ? popupId : null,
        'aria-label': this.selected ? `${toggleLabel}: ${triggerText}` : toggleLabel,
        disabled: disabled ? '' : null,
      },
    });
    trigger.appendChild(
      h('span', {
        class: [`${CLASS}__value`, !this.selected && `${CLASS}__value--placeholder`],
        text: triggerText,
      }),
    );
    trigger.appendChild(h('span', { class: `${CLASS}__icon`, html: CALENDAR_ICON }));
    trigger.addEventListener('click', () => (open ? this.closePopup(false) : this.openPopup()));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.openPopup();
      }
    });
    this.toggleEl = trigger;
    root.appendChild(trigger);

    this.dismissCleanup?.();
    this.dismissCleanup = null;
    this.escapeCleanup?.();
    this.escapeCleanup = null;
    this.gridEl = null;

    if (open) {
      this.dismissCleanup = listenDismiss(
        root,
        () => {
          this.open = false;
          this.rerender();
        },
        { escape: false },
      );

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          this.open = false;
          this.rerender();
          this.toggleEl?.focus();
        }
      };
      document.addEventListener('keydown', onKey);
      this.escapeCleanup = () => document.removeEventListener('keydown', onKey);

      root.appendChild(this.buildPopup(popupId, titleId, alignEnd));
    }

    return { root, slot: null };
  }

  private buildPopup(popupId: string, titleId: string, alignEnd: boolean): HTMLElement {
    const { minYm, maxYm, locale } = this;
    const prevDisabled = minYm != null && this.viewYear <= minYm.year;
    const nextDisabled = maxYm != null && this.viewYear >= maxYm.year;

    const popup = h('div', {
      class: [`${CLASS}__popup`, alignEnd && `${CLASS}__popup--end`],
      attrs: { id: popupId, role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': titleId },
    });

    const header = h('div', { class: `${CLASS}__header` });

    const prev = h('button', {
      class: `${CLASS}__nav`,
      attrs: { type: 'button', 'aria-label': 'Previous year', disabled: prevDisabled ? '' : null },
      html: chevronIcon('left'),
    });
    prev.addEventListener('click', () => {
      this.viewYear -= 1;
      this.rerender();
    });
    header.appendChild(prev);

    header.appendChild(
      h('h2', {
        class: `${CLASS}__title`,
        attrs: { id: titleId, 'aria-live': 'polite' },
        text: String(this.viewYear),
      }),
    );

    const next = h('button', {
      class: `${CLASS}__nav`,
      attrs: { type: 'button', 'aria-label': 'Next year', disabled: nextDisabled ? '' : null },
      html: chevronIcon('right'),
    });
    next.addEventListener('click', () => {
      this.viewYear += 1;
      this.rerender();
    });
    header.appendChild(next);

    popup.appendChild(header);

    const grid = h('div', {
      class: `${CLASS}__grid`,
      attrs: { role: 'group', 'aria-labelledby': titleId },
    });
    this.gridEl = grid;

    for (let month = 1; month <= 12; month++) {
      const ym = Temporal.PlainYearMonth.from({ year: this.viewYear, month });
      const isSelected = this.selected != null && ym.equals(this.selected);
      const isFocused = ym.equals(this.focused);
      const selectable = this.isSelectable(ym);
      const btn = h('button', {
        class: [`${CLASS}__month`, isSelected && `${CLASS}__month--selected`],
        attrs: {
          type: 'button',
          'data-month': ym.toString(),
          tabindex: isFocused ? 0 : -1,
          'aria-pressed': isSelected ? 'true' : 'false',
          'aria-disabled': !selectable ? 'true' : null,
          'aria-label': formatMonth(ym, locale, { year: 'numeric', month: 'long' }),
        },
        text: formatMonth(ym, locale, { month: 'short' }),
      });
      btn.addEventListener('click', () => this.selectMonth(ym));
      btn.addEventListener('keydown', (e) => this.onGridKeyDown(e));
      btn.addEventListener('focus', () => {
        this.focused = ym;
      });
      grid.appendChild(btn);
    }

    popup.appendChild(grid);
    return popup;
  }

  protected update(): void {
    super.update();
    if (this.open && this.focusCell) {
      this.focusCell = false;
      const el = this.gridEl?.querySelector<HTMLButtonElement>(
        `[data-month="${this.focused.toString()}"]`,
      );
      el?.focus();
    }
  }

  disconnectedCallback(): void {
    this.dismissCleanup?.();
    this.dismissCleanup = null;
    this.escapeCleanup?.();
    this.escapeCleanup = null;
  }
}

/** Parse an ISO `YYYY-MM` string, returning `null` when invalid. */
function safeParse(iso: string): Temporal.PlainYearMonth | null {
  try {
    return Temporal.PlainYearMonth.from(iso);
  } catch {
    return null;
  }
}
