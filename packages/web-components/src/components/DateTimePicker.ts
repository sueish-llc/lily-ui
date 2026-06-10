import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';
import { getDateTimeFormat, today, toPlainDateTime, toUTCDate, type PlainDateTimeInput } from '../utils/datetime';

const CLASS = 'lily-date-time-picker';

/** Day-of-week the calendar grid starts on: 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const pad2 = (n: number) => String(n).padStart(2, '0');

// --- Pure date helpers (Temporal) ------------------------------------------

/** Clamp `date` into the date range implied by the `[min, max]` bounds. */
function clampDate(
  date: Temporal.PlainDate,
  min: Temporal.PlainDateTime | undefined,
  max: Temporal.PlainDateTime | undefined,
): Temporal.PlainDate {
  if (min && Temporal.PlainDate.compare(date, min.toPlainDate()) < 0) return min.toPlainDate();
  if (max && Temporal.PlainDate.compare(date, max.toPlainDate()) > 0) return max.toPlainDate();
  return date;
}

/** Column (0-6) of `date` within a week starting on `weekStartsOn`. */
function columnIndex(date: Temporal.PlainDate, weekStartsOn: Weekday): number {
  return ((date.dayOfWeek % 7) - weekStartsOn + 7) % 7;
}

/** A fixed 6×7 grid of dates covering `month`, with leading/trailing days. */
function buildWeeks(month: Temporal.PlainYearMonth, weekStartsOn: Weekday): Temporal.PlainDate[][] {
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

/** Localized day label via a fixed-UTC `Date`; the logic stays in Temporal. */
function formatDay(
  date: Temporal.PlainDate,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  // Formatters are cached per locale + options (a render creates ~50 of them).
  // `toUTCDate` keeps years 0-99 intact (Date.UTC would map them to 1900-99).
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(toUTCDate(date));
}

function toBound(input: PlainDateTimeInput | undefined): Temporal.PlainDateTime | undefined {
  return input == null ? undefined : toPlainDateTime(input);
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
 * `<lily-date-time-picker>` — an accessible, Temporal-powered picker that
 * combines a month calendar with hour/minute steppers. The calendar is rendered
 * from plain elements and CSS, so its look and keyboard model are identical
 * across browsers, including Firefox.
 *
 * Calendar keyboard model (focus inside the grid):
 * - Arrow keys move by day / week, `Home`/`End` to week edges
 * - `PageUp`/`PageDown` move by month (hold `Shift` for years)
 * - `Enter`/`Space` selects, `Escape` closes
 *
 * Attributes: `value` (ISO datetime), `min`, `max`, `locale`, `week-starts-on`,
 * `minute-step`, `disabled`, `size`, `status`, `align-end`, `toggle-label`,
 * `id`, `name`. Dispatches a `change` event whose `detail` is the new ISO
 * datetime string (or `null` when cleared).
 *
 * @example
 * ```html
 * <lily-date-time-picker value="2026-05-30T09:30" minute-step="15"></lily-date-time-picker>
 * ```
 */
export class LilyDateTimePicker extends LilyElement {
  private reactId = uid();
  private open = false;
  private selected: Temporal.PlainDateTime | null = null;
  private draftTime: Temporal.PlainTime = Temporal.PlainTime.from({ hour: 0, minute: 0 });
  private todayDate: Temporal.PlainDate = today();
  private focusedDate: Temporal.PlainDate = this.todayDate;
  private focusDay = false;
  // Whether the `value` attribute was (re)set since the last sync. `setAttribute`
  // fires even for an unchanged string — how a host reverts an ignored `change`
  // (TimePicker's dirty-flag pattern).
  private valueAttrDirty = false;
  private seeded = false;

  private dismissCleanup: (() => void) | null = null;
  private escapeCleanup: (() => void) | null = null;
  private toggleEl: HTMLButtonElement | null = null;
  private gridEl: HTMLTableElement | null = null;
  private inputEl: HTMLInputElement | null = null;
  private hourSelEl: HTMLSelectElement | null = null;
  private minuteSelEl: HTMLSelectElement | null = null;
  /** Month the open grid was built for (to detect when a commit must rebuild). */
  private builtMonth: Temporal.PlainYearMonth | null = null;

  static get observedAttributes(): string[] {
    return [
      'value',
      'min',
      'max',
      'locale',
      'week-starts-on',
      'minute-step',
      'disabled',
      'size',
      'status',
      'align-end',
      'toggle-label',
      'id',
      'name',
    ];
  }

  // --- attribute-derived getters -------------------------------------------

  private get minDt(): Temporal.PlainDateTime | undefined {
    return toBound(this.attr('min'));
  }
  private get maxDt(): Temporal.PlainDateTime | undefined {
    return toBound(this.attr('max'));
  }
  private get weekStartsOn(): Weekday {
    return (((this.numAttr('week-starts-on', 1) % 7) + 7) % 7) as Weekday;
  }
  private get minuteStep(): number {
    return this.numAttr('minute-step', 5);
  }
  private get locale(): Intl.LocalesArgument {
    return this.attr('locale');
  }
  private get baseId(): string {
    return this.attr('id') ?? this.reactId;
  }

  // --- seeding / attribute sync --------------------------------------------

  attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    if (name === 'value') {
      this.valueAttrDirty = true;
      // Patch in place when possible: a full rebuild here would replace the
      // time `<select>`s mid-interaction (e.g. a controlled host echoing or
      // reverting from `change`) and drop focus to `<body>`.
      if (this.seeded && this.inputEl?.isConnected) {
        this.applyValueAttr();
        return;
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** Resync `selected`/`draftTime` from the `value` attribute, patching in place. */
  private applyValueAttr(): void {
    if (!this.valueAttrDirty) return;
    this.valueAttrDirty = false;
    const raw = this.getAttribute('value');
    const iso = raw == null || raw.trim() === '' ? '' : raw;
    const parsed = iso ? safeParse(iso) : null;
    const same =
      parsed === null ? this.selected === null : this.selected !== null && parsed.equals(this.selected);
    if (same) return;
    this.selected = parsed;
    if (parsed) this.draftTime = parsed.toPlainTime();
    this.syncSelectedUI();
  }

  private syncFromValue(): void {
    const raw = this.getAttribute('value');
    const iso = raw == null || raw.trim() === '' ? '' : raw;

    if (!this.seeded) {
      this.selected = iso ? safeParse(iso) : null;
      this.draftTime = this.selected
        ? this.selected.toPlainTime()
        : Temporal.PlainTime.from({ hour: 0, minute: 0 });
      this.focusedDate = clampDate(
        this.selected ? this.selected.toPlainDate() : this.todayDate,
        this.minDt,
        this.maxDt,
      );
      this.valueAttrDirty = false;
      this.seeded = true;
      return;
    }

    if (this.valueAttrDirty) {
      this.valueAttrDirty = false;
      const parsed = iso ? safeParse(iso) : null;
      const same =
        parsed === null ? this.selected === null : this.selected !== null && parsed.equals(this.selected);
      if (!same) {
        this.selected = parsed;
        if (parsed) this.draftTime = parsed.toPlainTime();
      }
    }
  }

  /**
   * Patch every value-derived bit of the built DOM in place (TimePicker's
   * `syncSelects` pattern): the field text, the day buttons' selected/tabstop
   * state, and the hour/minute selects — no rebuild, so the control being
   * operated keeps focus.
   */
  private syncSelectedUI(): void {
    if (this.inputEl) {
      this.inputEl.value = this.selected
        ? `${this.selected.toPlainDate().toString()} ${pad2(this.selected.hour)}:${pad2(this.selected.minute)}`
        : '';
    }
    if (this.hourSelEl) this.hourSelEl.value = String(this.draftTime.hour);
    if (this.minuteSelEl) this.minuteSelEl.value = String(this.draftTime.minute);
    if (this.gridEl) {
      const selectedIso = this.selected ? this.selected.toPlainDate().toString() : null;
      const focusedIso = this.focusedDate.toString();
      for (const btn of this.gridEl.querySelectorAll<HTMLButtonElement>(`.${CLASS}__day`)) {
        const date = btn.getAttribute('data-date');
        const isSelected = date === selectedIso;
        btn.classList.toggle(`${CLASS}__day--selected`, isSelected);
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        btn.tabIndex = date === focusedIso ? 0 : -1;
      }
    }
  }

  // --- date logic ----------------------------------------------------------

  private clampDateToBounds(date: Temporal.PlainDate): Temporal.PlainDate {
    return clampDate(date, this.minDt, this.maxDt);
  }

  private isSelectable(date: Temporal.PlainDate): boolean {
    const { minDt, maxDt } = this;
    if (minDt && Temporal.PlainDate.compare(date, minDt.toPlainDate()) < 0) return false;
    if (maxDt && Temporal.PlainDate.compare(date, maxDt.toPlainDate()) > 0) return false;
    return true;
  }

  private moveFocus(date: Temporal.PlainDate): void {
    this.focusDay = true;
    this.focusedDate = this.clampDateToBounds(date);
    this.rerender();
  }

  private openPopup(): void {
    if (this.boolAttr('disabled')) return;
    const now = today();
    this.todayDate = now;
    this.focusDay = true;
    this.focusedDate = this.clampDateToBounds(this.selected ? this.selected.toPlainDate() : now);
    this.open = true;
    this.rerender();
  }

  private closePopup(returnFocus: boolean): void {
    this.open = false;
    this.rerender();
    if (returnFocus) this.toggleEl?.focus();
  }

  /** Combine a day with the draft clock, clamp to bounds, and emit `change`. */
  private commit(
    date: Temporal.PlainDate,
    time: Temporal.PlainTime,
    close: boolean,
    focusDay = false,
  ): void {
    let next = date.toPlainDateTime(time);
    if (this.minDt && Temporal.PlainDateTime.compare(next, this.minDt) < 0) next = this.minDt;
    if (this.maxDt && Temporal.PlainDateTime.compare(next, this.maxDt) > 0) next = this.maxDt;
    const prevIso = this.selected ? this.selected.toString() : null;
    const nextIso = next.toString();
    this.selected = next;
    this.draftTime = next.toPlainTime();
    this.focusedDate = next.toPlainDate();
    if (prevIso !== nextIso) {
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: nextIso }));
    }
    if (close) {
      this.closePopup(true);
    } else if (focusDay) {
      // Rebuild and return focus to the (now selected) day button — without
      // the flag, Enter/click selection would drop focus to `<body>`.
      this.focusDay = true;
      this.rerender();
    } else if (this.builtMonth && !this.focusedDate.toPlainYearMonth().equals(this.builtMonth)) {
      // Clamping moved the focused day into another month: the grid itself
      // must be rebuilt for that month.
      this.rerender();
    } else {
      // Time-select changes patch in place so the `<select>` keeps focus.
      this.syncSelectedUI();
    }
  }

  private selectDate(date: Temporal.PlainDate): void {
    if (!this.isSelectable(date)) return;
    this.commit(date, this.draftTime, false, true);
  }

  private changeTime(time: Temporal.PlainTime): void {
    this.draftTime = time;
    const base = this.selected ? this.selected.toPlainDate() : this.focusedDate;
    this.commit(base, time, false);
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
    const invalid = this.attr('status') === 'danger';
    const alignEnd = this.boolAttr('align-end');
    const size = this.attr('size', 'md')!;
    const toggleLabel = this.attr('toggle-label', 'Choose date and time')!;
    const name = this.attr('name');
    const baseId = this.baseId;
    const popupId = `${baseId}-popup`;
    const titleId = `${baseId}-title`;
    const { open } = this;

    const root = h('div', {
      class: [
        CLASS,
        `${CLASS}--${size}`,
        invalid && `${CLASS}--invalid`,
        disabled && `${CLASS}--disabled`,
      ],
    });

    const field = h('div', { class: `${CLASS}__field` });

    const fieldText = this.selected
      ? `${this.selected.toPlainDate().toString()} ${pad2(this.selected.hour)}:${pad2(this.selected.minute)}`
      : '';
    const input = h('input', {
      class: `${CLASS}__input`,
      attrs: {
        id: baseId,
        name: name ?? null,
        type: 'text',
        readonly: '',
        autocomplete: 'off',
        placeholder: 'YYYY-MM-DD HH:MM',
        disabled: disabled ? '' : null,
        'aria-invalid': invalid ? 'true' : null,
      },
    });
    input.value = fieldText;
    this.inputEl = input;
    input.addEventListener('click', () => {
      if (!this.open) this.openPopup();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
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
    toggle.addEventListener('click', () => (open ? this.closePopup(false) : this.openPopup()));
    this.toggleEl = toggle;
    field.appendChild(toggle);

    root.appendChild(field);

    this.dismissCleanup?.();
    this.dismissCleanup = null;
    this.escapeCleanup?.();
    this.escapeCleanup = null;
    this.gridEl = null;
    this.hourSelEl = null;
    this.minuteSelEl = null;
    this.builtMonth = null;

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
    const viewMonth = this.focusedDate.toPlainYearMonth();
    this.builtMonth = viewMonth;
    const weeks = buildWeeks(viewMonth, this.weekStartsOn);
    const headerRow = weeks[0] ?? [];
    const { minDt, maxDt, locale } = this;

    const prevDisabled =
      minDt != null &&
      Temporal.PlainYearMonth.compare(viewMonth, minDt.toPlainDate().toPlainYearMonth()) <= 0;
    const nextDisabled =
      maxDt != null &&
      Temporal.PlainYearMonth.compare(viewMonth, maxDt.toPlainDate().toPlainYearMonth()) >= 0;

    const popup = h('div', {
      class: [`${CLASS}__popup`, alignEnd && `${CLASS}__popup--end`],
      attrs: {
        id: popupId,
        role: 'dialog',
        'aria-modal': 'false',
        'aria-labelledby': titleId,
      },
    });

    const header = h('div', { class: `${CLASS}__header` });

    const prev = h('button', {
      class: `${CLASS}__nav`,
      attrs: { type: 'button', 'aria-label': 'Previous month', disabled: prevDisabled ? '' : null },
      html: chevronIcon('left'),
    });
    prev.addEventListener('click', () => {
      this.focusedDate = this.clampDateToBounds(this.focusedDate.subtract({ months: 1 }));
      this.rerender();
    });
    header.appendChild(prev);

    header.appendChild(
      h('h2', {
        class: `${CLASS}__title`,
        attrs: { id: titleId, 'aria-live': 'polite' },
        text: formatDay(this.focusedDate, locale, { year: 'numeric', month: 'long' }),
      }),
    );

    const next = h('button', {
      class: `${CLASS}__nav`,
      attrs: { type: 'button', 'aria-label': 'Next month', disabled: nextDisabled ? '' : null },
      html: chevronIcon('right'),
    });
    next.addEventListener('click', () => {
      this.focusedDate = this.clampDateToBounds(this.focusedDate.add({ months: 1 }));
      this.rerender();
    });
    header.appendChild(next);

    popup.appendChild(header);

    const grid = h('table', { class: `${CLASS}__grid`, attrs: { 'aria-labelledby': titleId } });
    this.gridEl = grid;

    const thead = h('thead');
    const headTr = h('tr');
    for (const d of headerRow) {
      const th = h('th', { class: `${CLASS}__weekday`, attrs: { scope: 'col' } });
      th.appendChild(
        h('abbr', {
          attrs: { title: formatDay(d, locale, { weekday: 'long' }) },
          text: formatDay(d, locale, { weekday: 'short' }),
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
        const isSelected = this.selected != null && date.equals(this.selected.toPlainDate());
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
            'aria-label': formatDay(date, locale, {
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

    // --- time steppers ---
    const time = h('div', { class: `${CLASS}__time` });
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: Math.ceil(60 / this.minuteStep) }, (_, i) => i * this.minuteStep);

    const hourSel = h('select', {
      class: 'lily-select',
      attrs: { 'aria-label': 'Hour' },
    }) as HTMLSelectElement;
    for (const hr of hours) hourSel.appendChild(h('option', { attrs: { value: hr }, text: pad2(hr) }));
    hourSel.value = String(this.draftTime.hour);
    hourSel.addEventListener('change', () =>
      this.changeTime(this.draftTime.with({ hour: Number(hourSel.value) })),
    );
    this.hourSelEl = hourSel;

    const minuteSel = h('select', {
      class: 'lily-select',
      attrs: { 'aria-label': 'Minute' },
    }) as HTMLSelectElement;
    for (const mn of minutes) minuteSel.appendChild(h('option', { attrs: { value: mn }, text: pad2(mn) }));
    minuteSel.value = String(this.draftTime.minute);
    minuteSel.addEventListener('change', () =>
      this.changeTime(this.draftTime.with({ minute: Number(minuteSel.value) })),
    );
    this.minuteSelEl = minuteSel;

    time.append(
      hourSel,
      h('span', { class: `${CLASS}__time-sep`, attrs: { 'aria-hidden': 'true' }, text: ':' }),
      minuteSel,
    );
    popup.appendChild(time);

    return popup;
  }

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

/** Parse an ISO datetime string, returning `null` when invalid. */
function safeParse(iso: string): Temporal.PlainDateTime | null {
  try {
    return Temporal.PlainDateTime.from(iso);
  } catch {
    return null;
  }
}
