import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';
import { getDateTimeFormat, today, toUTCDate, type PlainDateInput } from '../utils/datetime';

const CLASS = 'lily-datepicker';

/** Day-of-week the calendar grid starts on: 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// --- Pure date helpers (Temporal) ------------------------------------------

/** Clamp `date` into the inclusive `[min, max]` range. */
function clamp(
  date: Temporal.PlainDate,
  min: Temporal.PlainDate | undefined,
  max: Temporal.PlainDate | undefined,
): Temporal.PlainDate {
  if (min && Temporal.PlainDate.compare(date, min) < 0) return min;
  if (max && Temporal.PlainDate.compare(date, max) > 0) return max;
  return date;
}

/** Column (0-6) of `date` within a week starting on `weekStartsOn`. */
function columnIndex(date: Temporal.PlainDate, weekStartsOn: Weekday): number {
  // Temporal dayOfWeek is 1 (Mon) … 7 (Sun); `% 7` gives JS-style 0 (Sun) … 6.
  return ((date.dayOfWeek % 7) - weekStartsOn + 7) % 7;
}

/** A fixed 6×7 grid of dates covering `month`, with leading/trailing days. */
function buildWeeks(
  month: Temporal.PlainYearMonth,
  weekStartsOn: Weekday,
): Temporal.PlainDate[][] {
  const first = month.toPlainDate({ day: 1 });
  const start = first.subtract({ days: columnIndex(first, weekStartsOn) });
  const weeks: Temporal.PlainDate[][] = [];
  let cursor = start;
  for (let w = 0; w < 6; w++) {
    const row: Temporal.PlainDate[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(cursor);
      cursor = cursor.add({ days: 1 });
    }
    weeks.push(row);
  }
  return weeks;
}

/**
 * Format a `Temporal.PlainDate` for display via `Intl.DateTimeFormat`.
 *
 * We format through a fixed-UTC `Date` rather than `PlainDate.toLocaleString`
 * because option support for the latter still varies across engines (notably,
 * some runtimes ignore `month`/`weekday` styles). Going through `Intl` directly
 * gives identical, correct labels in every browser. All date *logic* stays in
 * Temporal — only the human-readable label is produced here.
 */
function formatPlain(
  date: Temporal.PlainDate,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  // Formatters are cached per locale + options (a render creates ~50 of them).
  // `toUTCDate` keeps years 0-99 intact (Date.UTC would map them to 1900-99).
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(toUTCDate(date));
}

/**
 * Coerce an optional `PlainDateInput` to a `PlainDate` (or `undefined`).
 * Invalid strings (e.g. a malformed `min`/`max` attribute) yield `undefined`
 * instead of throwing out of `connectedCallback`.
 */
function toBound(input: PlainDateInput | undefined): Temporal.PlainDate | undefined {
  if (input == null) return undefined;
  if (typeof input === 'string') return safeParse(input) ?? undefined;
  return input;
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
 * `<lily-date-picker>` — an accessible, Temporal-powered date picker: a text
 * field (ISO `YYYY-MM-DD`) paired with a keyboard-navigable calendar popup.
 *
 * The calendar is rendered from plain elements and CSS — no native
 * `<input type="date">` — so its appearance and keyboard model are identical
 * across browsers, including Firefox. All date arithmetic uses the standard
 * `Temporal` API (native on Node 26; polyfilled elsewhere).
 *
 * Calendar keyboard model (focus inside the grid):
 * - Arrow keys move by day / week, `Home`/`End` to week edges
 * - `PageUp`/`PageDown` move by month (hold `Shift` for years)
 * - `Enter`/`Space` selects, `Escape` closes
 *
 * Attributes: `value` (ISO `YYYY-MM-DD`), `min`, `max`, `locale`,
 * `week-starts-on`, `disabled`, `invalid`, `align-end`, `placeholder`,
 * `toggle-label`, `id`, `name`, `required`. The `isDateDisabled` predicate is
 * exposed as a JS property (it cannot be an attribute). Dispatches a `change`
 * event whose `detail` is the new ISO date string (or `null` when cleared).
 *
 * @example
 * ```html
 * <lily-date-picker value="2026-05-31" min="2026-01-01"></lily-date-picker>
 * ```
 */
export class LilyDatePicker extends LilyElement {
  /**
   * Optional predicate to disable individual dates (e.g. weekends, holidays).
   * Set as a JS property — it cannot be expressed as an attribute.
   */
  isDateDisabled?: (date: Temporal.PlainDate) => boolean;

  private reactId = uid();
  private open = false;
  private parseError = false;
  private selected: Temporal.PlainDate | null = null;
  private text = '';
  private todayDate: Temporal.PlainDate = today();
  private focusedDate: Temporal.PlainDate = this.todayDate;
  // When true, the next rerender should move DOM focus into the grid (keyboard
  // navigation / opening) rather than leaving it on a nav button.
  private focusDay = false;
  // Whether the `value` attribute was (re)set since the last sync. The
  // component behaves uncontrolled (internal selection wins), but every
  // *attribute* write — including re-setting the same string to revert an
  // ignored `change` — resyncs the text field (TimePicker's dirty-flag
  // pattern), mirroring React's effect on the controlled value.
  private valueAttrDirty = false;
  // Whether internal state has been seeded from attributes yet.
  private seeded = false;

  private dismissCleanup: (() => void) | null = null;
  private escapeCleanup: (() => void) | null = null;
  private toggleEl: HTMLButtonElement | null = null;
  private gridEl: HTMLTableElement | null = null;

  static get observedAttributes(): string[] {
    return [
      'value',
      'min',
      'max',
      'locale',
      'week-starts-on',
      'disabled',
      'invalid',
      'align-end',
      'placeholder',
      'toggle-label',
      'id',
      'name',
      'required',
    ];
  }

  // --- attribute-derived getters -------------------------------------------

  private get minDate(): Temporal.PlainDate | undefined {
    return toBound(this.attr('min'));
  }

  private get maxDate(): Temporal.PlainDate | undefined {
    return toBound(this.attr('max'));
  }

  private get weekStartsOn(): Weekday {
    return (((this.numAttr('week-starts-on', 1) % 7) + 7) % 7) as Weekday;
  }

  private get locale(): Intl.LocalesArgument {
    return this.attr('locale');
  }

  private get baseId(): string {
    return this.attr('id') ?? this.reactId;
  }

  // --- seeding / attribute sync --------------------------------------------

  attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    // `setAttribute` fires this even when the value is unchanged, which is how
    // a host reverts an ignored `change` (string comparison alone misses it).
    if (name === 'value') this.valueAttrDirty = true;
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /**
   * Seed `selected`/`text`/`focusedDate` from the `value` attribute. Re-runs on
   * each render so an external `value` change syncs the text field — compared
   * as parsed dates so an echo of the date just committed doesn't clobber what
   * the user typed.
   */
  private syncFromValue(): void {
    const raw = this.getAttribute('value');
    const iso = raw == null || raw.trim() === '' ? '' : raw;

    if (!this.seeded) {
      // Initial seed from the `value` attribute.
      this.selected = iso ? safeParse(iso) : null;
      this.text = this.selected ? this.selected.toString() : '';
      this.parseError = false;
      this.focusedDate = this.selected ?? clamp(this.todayDate, this.minDate, this.maxDate);
      this.valueAttrDirty = false;
      this.seeded = true;
      return;
    }

    if (this.valueAttrDirty) {
      // An external `value` attribute write resyncs the text field — mirroring
      // React's effect on the controlled `selectedIso`.
      this.valueAttrDirty = false;
      const parsed = iso ? safeParse(iso) : null;
      const same =
        parsed === null ? this.selected === null : this.selected !== null && parsed.equals(this.selected);
      if (!same) {
        this.selected = parsed;
        this.text = parsed ? parsed.toString() : '';
        this.parseError = false;
      }
    }
  }

  // --- date logic ----------------------------------------------------------

  private clampToBounds(date: Temporal.PlainDate): Temporal.PlainDate {
    return clamp(date, this.minDate, this.maxDate);
  }

  private isSelectable(date: Temporal.PlainDate): boolean {
    const { minDate, maxDate } = this;
    if (minDate && Temporal.PlainDate.compare(date, minDate) < 0) return false;
    if (maxDate && Temporal.PlainDate.compare(date, maxDate) > 0) return false;
    return !this.isDateDisabled?.(date);
  }

  private moveFocus(date: Temporal.PlainDate): void {
    this.focusDay = true;
    this.focusedDate = this.clampToBounds(date);
    this.rerender();
  }

  private openPopup(): void {
    if (this.boolAttr('disabled')) return;
    const now = today();
    this.todayDate = now;
    this.focusDay = true;
    this.focusedDate = this.clampToBounds(this.selected ?? now);
    this.open = true;
    this.rerender();
  }

  private closePopup(returnFocus: boolean): void {
    this.open = false;
    this.rerender();
    if (returnFocus) this.toggleEl?.focus();
  }

  /** Update the selection and emit `change` when the ISO date actually changes. */
  private setSelected(date: Temporal.PlainDate | null): void {
    const prevIso = this.selected ? this.selected.toString() : null;
    const nextIso = date ? date.toString() : null;
    this.selected = date;
    if (prevIso !== nextIso) {
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: nextIso }));
    }
  }

  private selectDate(date: Temporal.PlainDate): void {
    if (!this.isSelectable(date)) return;
    this.setSelected(date);
    this.text = date.toString();
    this.focusedDate = date;
    this.parseError = false;
    this.closePopup(true);
  }

  private commitText(): void {
    const trimmed = this.text.trim();
    if (trimmed === '') {
      this.setSelected(null);
      this.text = '';
      this.parseError = false;
      this.rerender();
      return;
    }
    let parsed: Temporal.PlainDate | null = null;
    try {
      parsed = Temporal.PlainDate.from(trimmed, { overflow: 'reject' });
    } catch {
      parsed = null;
    }
    if (parsed && this.isSelectable(parsed)) {
      this.setSelected(parsed);
      this.text = parsed.toString();
      this.focusedDate = parsed;
      this.parseError = false;
    } else {
      this.parseError = true;
    }
    this.rerender();
  }

  private onGridKeyDown(e: KeyboardEvent): void {
    const f = this.focusedDate;
    switch (e.key) {
      case 'ArrowLeft':
        this.moveFocus(f.subtract({ days: 1 }));
        break;
      case 'ArrowRight':
        this.moveFocus(f.add({ days: 1 }));
        break;
      case 'ArrowUp':
        this.moveFocus(f.subtract({ days: 7 }));
        break;
      case 'ArrowDown':
        this.moveFocus(f.add({ days: 7 }));
        break;
      case 'Home':
        this.moveFocus(f.subtract({ days: columnIndex(f, this.weekStartsOn) }));
        break;
      case 'End':
        this.moveFocus(f.add({ days: 6 - columnIndex(f, this.weekStartsOn) }));
        break;
      case 'PageUp':
        this.moveFocus(f.subtract(e.shiftKey ? { years: 1 } : { months: 1 }));
        break;
      case 'PageDown':
        this.moveFocus(f.add(e.shiftKey ? { years: 1 } : { months: 1 }));
        break;
      case 'Enter':
      case ' ':
        this.selectDate(f);
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  // --- render --------------------------------------------------------------

  protected build(): BuildResult {
    this.syncFromValue();

    const disabled = this.boolAttr('disabled');
    const invalid = this.boolAttr('invalid');
    const alignEnd = this.boolAttr('align-end');
    const placeholder = this.attr('placeholder', 'YYYY-MM-DD')!;
    const toggleLabel = this.attr('toggle-label', 'Choose date')!;
    const name = this.attr('name');
    const required = this.boolAttr('required');
    const baseId = this.baseId;
    const popupId = `${baseId}-popup`;
    const titleId = `${baseId}-title`;
    const { open } = this;

    const root = h('div', {
      class: [
        CLASS,
        (invalid || this.parseError) && `${CLASS}--invalid`,
        disabled && `${CLASS}--disabled`,
      ],
    });

    // --- field row ---
    const field = h('div', { class: `${CLASS}__field` });

    const input = h('input', {
      class: `${CLASS}__input`,
      attrs: {
        id: baseId,
        name: name ?? null,
        type: 'text',
        inputmode: 'numeric',
        autocomplete: 'off',
        placeholder,
        disabled: disabled ? '' : null,
        required: required ? '' : null,
        'aria-invalid': invalid || this.parseError ? 'true' : null,
      },
    });
    input.value = this.text;
    input.addEventListener('input', () => {
      this.text = input.value;
    });
    input.addEventListener('blur', () => this.commitText());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.commitText();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.openPopup();
      }
    });
    field.appendChild(input);

    const toggle = h('button', {
      class: `${CLASS}__toggle`,
      attrs: {
        type: 'button',
        'aria-label': toggleLabel,
        'aria-haspopup': 'dialog',
        'aria-expanded': open ? 'true' : 'false',
        'aria-controls': open ? popupId : null,
        disabled: disabled ? '' : null,
      },
      html: CALENDAR_ICON,
    });
    toggle.addEventListener('click', () =>
      open ? this.closePopup(false) : this.openPopup(),
    );
    this.toggleEl = toggle;
    field.appendChild(toggle);

    root.appendChild(field);

    // Manage the dismiss / Escape listeners in step with the open state.
    this.dismissCleanup?.();
    this.dismissCleanup = null;
    this.escapeCleanup?.();
    this.escapeCleanup = null;
    this.gridEl = null;

    if (open) {
      // Close on outside click; Escape is handled separately so we can restore
      // focus to the toggle (the WAI-ARIA dialog expectation).
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

    // Fully built; no authored children are slotted.
    return { root, slot: null };
  }

  private buildPopup(popupId: string, titleId: string, alignEnd: boolean): HTMLElement {
    const viewMonth = this.focusedDate.toPlainYearMonth();
    const weeks = buildWeeks(viewMonth, this.weekStartsOn);
    const headerRow = weeks[0] ?? [];
    const { minDate, maxDate, locale } = this;

    const prevDisabled =
      minDate != null &&
      Temporal.PlainYearMonth.compare(viewMonth, minDate.toPlainYearMonth()) <= 0;
    const nextDisabled =
      maxDate != null &&
      Temporal.PlainYearMonth.compare(viewMonth, maxDate.toPlainYearMonth()) >= 0;

    const popup = h('div', {
      class: [`${CLASS}__popup`, alignEnd && `${CLASS}__popup--end`],
      attrs: {
        id: popupId,
        role: 'dialog',
        'aria-modal': 'false',
        'aria-labelledby': titleId,
      },
    });

    // --- header (nav + title) ---
    const header = h('div', { class: `${CLASS}__header` });

    const prev = h('button', {
      class: `${CLASS}__nav`,
      attrs: {
        type: 'button',
        'aria-label': 'Previous month',
        disabled: prevDisabled ? '' : null,
      },
      html: chevronIcon('left'),
    });
    prev.addEventListener('click', () => {
      this.focusedDate = this.clampToBounds(this.focusedDate.subtract({ months: 1 }));
      this.rerender();
    });
    header.appendChild(prev);

    header.appendChild(
      h('h2', {
        class: `${CLASS}__title`,
        attrs: { id: titleId, 'aria-live': 'polite' },
        text: formatPlain(this.focusedDate, locale, { year: 'numeric', month: 'long' }),
      }),
    );

    const next = h('button', {
      class: `${CLASS}__nav`,
      attrs: {
        type: 'button',
        'aria-label': 'Next month',
        disabled: nextDisabled ? '' : null,
      },
      html: chevronIcon('right'),
    });
    next.addEventListener('click', () => {
      this.focusedDate = this.clampToBounds(this.focusedDate.add({ months: 1 }));
      this.rerender();
    });
    header.appendChild(next);

    popup.appendChild(header);

    // --- grid ---
    const grid = h('table', {
      class: `${CLASS}__grid`,
      attrs: { 'aria-labelledby': titleId },
    });
    this.gridEl = grid;

    const thead = h('thead');
    const headTr = h('tr');
    for (const d of headerRow) {
      const th = h('th', { class: `${CLASS}__weekday`, attrs: { scope: 'col' } });
      th.appendChild(
        h('abbr', {
          attrs: { title: formatPlain(d, locale, { weekday: 'long' }) },
          text: formatPlain(d, locale, { weekday: 'short' }),
        }),
      );
      headTr.appendChild(th);
    }
    thead.appendChild(headTr);
    grid.appendChild(thead);

    const tbody = h('tbody');
    for (const week of weeks) {
      const tr = h('tr');
      for (const date of week) {
        const inMonth = date.month === viewMonth.month;
        const isSelected = this.selected != null && date.equals(this.selected);
        const isFocused = date.equals(this.focusedDate);
        const isToday = date.equals(this.todayDate);
        const selectable = this.isSelectable(date);

        const td = h('td');
        const btn = h('button', {
          class: [
            `${CLASS}__day`,
            !inMonth && `${CLASS}__day--outside`,
            isToday && `${CLASS}__day--today`,
            isSelected && `${CLASS}__day--selected`,
          ],
          attrs: {
            type: 'button',
            'data-date': date.toString(),
            tabindex: isFocused ? 0 : -1,
            'aria-pressed': isSelected ? 'true' : 'false',
            'aria-current': isToday ? 'date' : null,
            'aria-disabled': !selectable ? 'true' : null,
            'aria-label': formatPlain(date, locale, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          },
          text: String(date.day),
        });
        btn.addEventListener('click', () => this.selectDate(date));
        btn.addEventListener('keydown', (e) => this.onGridKeyDown(e));
        btn.addEventListener('focus', () => {
          this.focusedDate = date;
        });
        td.appendChild(btn);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    grid.appendChild(tbody);
    popup.appendChild(grid);

    return popup;
  }

  /** Move DOM focus to the active day after a navigation-triggered rerender. */
  protected update(): void {
    super.update();
    if (this.open && this.focusDay) {
      this.focusDay = false;
      const el = this.gridEl?.querySelector<HTMLButtonElement>(
        `[data-date="${this.focusedDate.toString()}"]`,
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

/** Parse an ISO `YYYY-MM-DD` string, returning `null` when invalid. */
function safeParse(iso: string): Temporal.PlainDate | null {
  try {
    return Temporal.PlainDate.from(iso, { overflow: 'reject' });
  } catch {
    return null;
  }
}
