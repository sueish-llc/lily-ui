import { LilyElement, h, type BuildResult } from '../base/LilyElement';
import { getDateTimeFormat, today, toUTCDate } from '../utils/datetime';

/** Parse an ISO `YYYY-MM-DD` attribute, returning `null` when invalid. */
function safeParse(iso: string): Temporal.PlainDate | null {
  try {
    return Temporal.PlainDate.from(iso, { overflow: 'reject' });
  } catch {
    return null;
  }
}

/**
 * `<lily-calendar>` — an inline month grid for date selection. Dispatches a
 * `change` event whose `detail` is the selected ISO date string.
 *
 * Attributes: `value`, `min`, `max`, `locale`, `week-starts-on`, `label`.
 */
export class LilyCalendar extends LilyElement {
  private value: Temporal.PlainDate | null = null;
  private view: Temporal.PlainDate = today().with({ day: 1 });
  private initialized = false;
  // Whether the `value` attribute was (re)set since the last sync. Internal
  // selection wins, but every *attribute* write — including re-setting the
  // same string to revert an ignored `change` — resyncs the selection
  // (TimePicker's dirty-flag pattern) so the element stays controllable.
  private valueAttrDirty = false;
  // When true, the next rerender moves DOM focus back to the selected day
  // button (the rebuild would otherwise drop focus to `<body>` after a
  // click / Enter on a day — DatePicker's `focusDay` pattern).
  private focusSelectedDay = false;

  static get observedAttributes(): string[] {
    return ['value', 'min', 'max', 'locale', 'week-starts-on', 'label'];
  }

  attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    // `setAttribute` fires this even when the value is unchanged, which is how
    // a host reverts an ignored `change` (string comparison alone misses it).
    if (name === 'value') this.valueAttrDirty = true;
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  protected build(): BuildResult {
    const raw = this.getAttribute('value');
    if (!this.initialized) {
      this.value = raw ? safeParse(raw) : null;
      this.view = (this.value ?? today()).with({ day: 1 });
      this.valueAttrDirty = false;
      this.initialized = true;
    } else if (this.valueAttrDirty) {
      // An external `value` attribute write resyncs the selection — mirroring
      // React's controlled `value` prop. Compare the parsed dates so a host
      // echo of the value just selected doesn't clobber internal state.
      this.valueAttrDirty = false;
      const parsed = raw ? safeParse(raw) : null;
      const same =
        parsed === null ? this.value === null : this.value !== null && parsed.equals(this.value);
      if (!same) this.value = parsed;
    }
    const weekStartsOn = this.numAttr('week-starts-on', 1);
    const locale = this.attr('locale') || undefined;
    const min = this.attr('min') ? safeParse(this.attr('min')!) ?? undefined : undefined;
    const max = this.attr('max') ? safeParse(this.attr('max')!) ?? undefined : undefined;
    // Formatters are cached per locale + options (a render creates ~50 of them).
    // `toUTCDate` keeps years 0-99 intact (Date.UTC would map them to 1900-99).
    const fmt = (d: Temporal.PlainDate, opts: Intl.DateTimeFormatOptions) =>
      getDateTimeFormat(locale, { timeZone: 'UTC', ...opts }).format(toUTCDate(d));
    const gridStart = this.view.subtract({ days: (this.view.dayOfWeek - weekStartsOn + 7) % 7 });
    const days = Array.from({ length: 42 }, (_, i) => gridStart.add({ days: i }));
    const weekdays = Array.from({ length: 7 }, (_, i) => fmt(gridStart.add({ days: i }), { weekday: 'short' }));
    const disabled = (d: Temporal.PlainDate) =>
      (!!min && Temporal.PlainDate.compare(d, min) < 0) || (!!max && Temporal.PlainDate.compare(d, max) > 0);

    const root = h('div', { class: 'lily-calendar' });
    const header = h('div', { class: 'lily-calendar__header' });
    const prev = h('button', { class: 'lily-calendar__nav', attrs: { type: 'button', 'aria-label': '前の月' } });
    prev.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '‹' }));
    prev.addEventListener('click', () => {
      this.view = this.view.subtract({ months: 1 });
      this.rerender();
    });
    const next = h('button', { class: 'lily-calendar__nav', attrs: { type: 'button', 'aria-label': '次の月' } });
    next.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '›' }));
    next.addEventListener('click', () => {
      this.view = this.view.add({ months: 1 });
      this.rerender();
    });
    header.append(prev, h('span', { class: 'lily-calendar__title', attrs: { 'aria-live': 'polite' }, text: fmt(this.view, { year: 'numeric', month: 'long' }) }), next);
    root.appendChild(header);

    const grid = h('div', { class: 'lily-calendar__grid', attrs: { role: 'group', 'aria-label': this.attr('label', 'Calendar')! } });
    for (const wd of weekdays) grid.appendChild(h('span', { class: 'lily-calendar__weekday', attrs: { 'aria-hidden': 'true' }, text: wd }));
    for (const d of days) {
      const outside = d.month !== this.view.month;
      const btn = h('button', {
        class: ['lily-calendar__day', outside && 'lily-calendar__day--outside', d.equals(today()) && 'lily-calendar__day--today'],
        attrs: {
          type: 'button',
          'aria-pressed': String(this.value != null && d.equals(this.value)),
          'aria-label': fmt(d, { year: 'numeric', month: 'long', day: 'numeric' }),
          disabled: disabled(d) ? '' : null,
        },
        text: String(d.day),
      });
      btn.addEventListener('click', () => {
        this.value = d;
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: d.toString() }));
        if (outside) this.view = d.with({ day: 1 });
        // The rebuild replaces the clicked button; refocus its successor so
        // keyboard users aren't dropped to `<body>`.
        this.focusSelectedDay = true;
        this.rerender();
      });
      grid.appendChild(btn);
    }
    root.appendChild(grid);
    return { root, slot: null };
  }

  /** Move DOM focus back to the selected day after a selection rerender. */
  protected update(): void {
    super.update();
    if (this.focusSelectedDay) {
      this.focusSelectedDay = false;
      this.querySelector<HTMLButtonElement>('.lily-calendar__day[aria-pressed="true"]')?.focus();
    }
  }
}
