<script lang="ts">
import { getDateTimeFormat, toUtcDate } from '../../utils/datetime';

/** Day-of-week the calendar grid starts on: 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// --- Pure date helpers (Temporal) ------------------------------------------

/** Clamp `date` into the inclusive `[min, max]` range. */
export function clamp(
  date: Temporal.PlainDate,
  min: Temporal.PlainDate | undefined,
  max: Temporal.PlainDate | undefined,
): Temporal.PlainDate {
  if (min && Temporal.PlainDate.compare(date, min) < 0) return min;
  if (max && Temporal.PlainDate.compare(date, max) > 0) return max;
  return date;
}

/** Column (0-6) of `date` within a week starting on `weekStartsOn`. */
export function columnIndex(date: Temporal.PlainDate, weekStartsOn: Weekday): number {
  // Temporal dayOfWeek is 1 (Mon) … 7 (Sun); `% 7` gives JS-style 0 (Sun) … 6.
  return ((date.dayOfWeek % 7) - weekStartsOn + 7) % 7;
}

/** A fixed 6×7 grid of dates covering `month`, with leading/trailing days. */
export function buildWeeks(
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
export function formatPlain(
  date: Temporal.PlainDate,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  const utc = toUtcDate(date.year, date.month, date.day);
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(utc);
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useId, watch, type InputHTMLAttributes } from 'vue';
import { cx } from '../../utils/cx';
import { today, toPlainDate, type PlainDateInput } from '../../utils/datetime';
import { useDismiss } from '../../composables/interactions';

const CLASS = 'lily-datepicker';

/**
 * An accessible, Temporal-powered date picker: a text field (ISO `YYYY-MM-DD`)
 * paired with a keyboard-navigable calendar popup. Supports `v-model`.
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
 * @example
 * ```vue
 * <DatePicker v-model="due" :min="today()" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Earliest selectable date (inclusive). ISO `YYYY-MM-DD` strings accepted. */
    min?: PlainDateInput;
    /** Latest selectable date (inclusive). ISO `YYYY-MM-DD` strings accepted. */
    max?: PlainDateInput;
    /** Disable individual dates (e.g. weekends, holidays). */
    isDateDisabled?: (date: Temporal.PlainDate) => boolean;
    /** BCP-47 locale for month / weekday names. Defaults to the host locale. */
    locale?: Intl.LocalesArgument;
    /** Which weekday the grid starts on. @default 1 (Monday) */
    weekStartsOn?: Weekday;
    /** Disable the whole control. */
    disabled?: boolean;
    /** Mark the field as invalid (combined with internal parse errors). */
    invalid?: boolean;
    /** Align the calendar popup to the field's end (right) edge. @default false */
    alignEnd?: boolean;
    /** Placeholder for the text field. @default 'YYYY-MM-DD' */
    placeholder?: string;
    /** Accessible label for the calendar toggle button. @default 'Choose date' */
    toggleLabel?: string;
    /** `id` for the text input (an auto-generated id is used otherwise). */
    id?: string;
    /** `name` for the text input, for form submission. */
    name?: string;
    /** Mark the field as required. */
    required?: boolean;
    /** Extra props forwarded to the text `<input>`. */
    inputProps?: Omit<
      InputHTMLAttributes,
      'value' | 'onChange' | 'disabled' | 'required' | 'name' | 'id'
    >;
  }>(),
  {
    weekStartsOn: 1,
    disabled: false,
    invalid: false,
    alignEnd: false,
    placeholder: 'YYYY-MM-DD',
    toggleLabel: 'Choose date',
  },
);

/** Selected date; bind with `v-model`. Pass `null` for "no selection". */
const selected = defineModel<Temporal.PlainDate | null>({ default: null });

const reactId = useId();
const baseId = computed(() => props.id ?? reactId);
const popupId = computed(() => `${baseId.value}-popup`);
const titleId = computed(() => `${baseId.value}-title`);

const rootRef = ref<HTMLDivElement | null>(null);
const toggleRef = ref<HTMLButtonElement | null>(null);
const gridRef = ref<HTMLTableElement | null>(null);
// When true, the next focusedDate change should move DOM focus into the grid
// (keyboard navigation / opening) rather than leaving it on a nav button.
let focusDay = false;

const minDate = computed(() => toBound(props.min));
const maxDate = computed(() => toBound(props.max));

const open = ref(false);
const parseError = ref(false);
const text = ref(selected.value ? selected.value.toString() : '');
const todayDate = ref(today());
const focusedDate = ref<Temporal.PlainDate>(
  selected.value ?? clamp(todayDate.value, minDate.value, maxDate.value),
);

/**
 * Coerce an optional `PlainDateInput` to a `PlainDate` (or `undefined`).
 * Parsed with the same safe-parse approach as the typed value: an invalid ISO
 * string is treated as "no bound" rather than throwing during render.
 */
function toBound(input: PlainDateInput | undefined): Temporal.PlainDate | undefined {
  if (input == null) return undefined;
  try {
    return toPlainDate(input);
  } catch {
    return undefined;
  }
}

// Keep the text field in sync when the value changes from the outside (or via
// the calendar). Keyed on the ISO string so a re-created PlainDate instance
// for the same day doesn't clobber what the user is typing.
const selectedIso = computed(() => (selected.value ? selected.value.toString() : ''));
watch(
  selectedIso,
  (iso) => {
    text.value = iso;
    parseError.value = false;
  },
);

function clampToBounds(date: Temporal.PlainDate): Temporal.PlainDate {
  return clamp(date, minDate.value, maxDate.value);
}

function isSelectable(date: Temporal.PlainDate): boolean {
  if (minDate.value && Temporal.PlainDate.compare(date, minDate.value) < 0) return false;
  if (maxDate.value && Temporal.PlainDate.compare(date, maxDate.value) > 0) return false;
  return !props.isDateDisabled?.(date);
}

function moveFocus(date: Temporal.PlainDate) {
  focusDay = true;
  focusedDate.value = clampToBounds(date);
}

function openPopup() {
  if (props.disabled) return;
  const now = today();
  todayDate.value = now;
  focusDay = true;
  focusedDate.value = clampToBounds(selected.value ?? now);
  open.value = true;
}

function closePopup(returnFocus: boolean) {
  open.value = false;
  if (returnFocus) toggleRef.value?.focus();
}

function selectDate(date: Temporal.PlainDate) {
  if (!isSelectable(date)) return;
  selected.value = date;
  focusedDate.value = date;
  parseError.value = false;
  closePopup(true);
}

function commitText() {
  const trimmed = text.value.trim();
  if (trimmed === '') {
    selected.value = null;
    parseError.value = false;
    return;
  }
  let parsed: Temporal.PlainDate | null = null;
  try {
    parsed = Temporal.PlainDate.from(trimmed, { overflow: 'reject' });
  } catch {
    parsed = null;
  }
  if (parsed && isSelectable(parsed)) {
    selected.value = parsed;
    focusedDate.value = parsed;
    parseError.value = false;
  } else {
    parseError.value = true;
  }
}

// Close on outside click; Escape is handled separately so we can restore
// focus to the toggle (the WAI-ARIA dialog expectation).
useDismiss(rootRef, open, () => (open.value = false), { escape: false });

// Escape closes and returns focus to the toggle.
watch(open, (isOpen, _prev, onCleanup) => {
  if (!isOpen) return;
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      open.value = false;
      toggleRef.value?.focus();
    }
  };
  document.addEventListener('keydown', onKey);
  onCleanup(() => document.removeEventListener('keydown', onKey));
});

// Move DOM focus to the active day when navigating with the keyboard.
watch([open, focusedDate], async () => {
  if (!open.value || !focusDay) return;
  focusDay = false;
  await nextTick();
  const el = gridRef.value?.querySelector<HTMLButtonElement>(
    `[data-date="${focusedDate.value.toString()}"]`,
  );
  el?.focus();
});

const viewMonth = computed(() => focusedDate.value.toPlainYearMonth());
const weeks = computed(() => buildWeeks(viewMonth.value, props.weekStartsOn));
const headerRow = computed(() => weeks.value[0] ?? []);

const prevDisabled = computed(
  () =>
    minDate.value != null &&
    Temporal.PlainYearMonth.compare(viewMonth.value, minDate.value.toPlainYearMonth()) <= 0,
);
const nextDisabled = computed(
  () =>
    maxDate.value != null &&
    Temporal.PlainYearMonth.compare(viewMonth.value, maxDate.value.toPlainYearMonth()) >= 0,
);

function onGridKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowLeft':
      moveFocus(focusedDate.value.subtract({ days: 1 }));
      break;
    case 'ArrowRight':
      moveFocus(focusedDate.value.add({ days: 1 }));
      break;
    case 'ArrowUp':
      moveFocus(focusedDate.value.subtract({ days: 7 }));
      break;
    case 'ArrowDown':
      moveFocus(focusedDate.value.add({ days: 7 }));
      break;
    case 'Home':
      moveFocus(focusedDate.value.subtract({ days: columnIndex(focusedDate.value, props.weekStartsOn) }));
      break;
    case 'End':
      moveFocus(focusedDate.value.add({ days: 6 - columnIndex(focusedDate.value, props.weekStartsOn) }));
      break;
    case 'PageUp':
      moveFocus(focusedDate.value.subtract(e.shiftKey ? { years: 1 } : { months: 1 }));
      break;
    case 'PageDown':
      moveFocus(focusedDate.value.add(e.shiftKey ? { years: 1 } : { months: 1 }));
      break;
    case 'Enter':
    case ' ':
      selectDate(focusedDate.value);
      break;
    default:
      return;
  }
  e.preventDefault();
}

function onInputKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    commitText();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    openPopup();
  }
}

// Class helpers for a calendar day cell.
function dayClass(date: Temporal.PlainDate): string {
  const inMonth = date.month === viewMonth.value.month;
  const isSelected = selected.value != null && date.equals(selected.value);
  const isToday = date.equals(todayDate.value);
  return cx(`${CLASS}__day`, {
    [`${CLASS}__day--outside`]: !inMonth,
    [`${CLASS}__day--today`]: isToday,
    [`${CLASS}__day--selected`]: isSelected,
  });
}
</script>

<template>
  <div
    ref="rootRef"
    :class="
      cx(
        CLASS,
        (invalid || parseError) && `${CLASS}--invalid`,
        disabled && `${CLASS}--disabled`,
      )
    "
  >
    <div :class="`${CLASS}__field`">
      <input
        v-bind="inputProps"
        :id="baseId"
        :name="name"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :class="`${CLASS}__input`"
        :placeholder="placeholder"
        :value="text"
        :disabled="disabled"
        :required="required"
        :aria-invalid="invalid || parseError || undefined"
        @input="text = ($event.target as HTMLInputElement).value"
        @blur="commitText()"
        @keydown="onInputKeyDown"
      />
      <button
        ref="toggleRef"
        type="button"
        :class="`${CLASS}__toggle`"
        :aria-label="toggleLabel"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-controls="open ? popupId : undefined"
        :disabled="disabled"
        @click="open ? closePopup(false) : openPopup()"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.7" />
          <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div
      v-if="open"
      :id="popupId"
      role="dialog"
      aria-modal="false"
      :aria-labelledby="titleId"
      :class="cx(`${CLASS}__popup`, alignEnd && `${CLASS}__popup--end`)"
    >
      <div :class="`${CLASS}__header`">
        <button
          type="button"
          :class="`${CLASS}__nav`"
          aria-label="Previous month"
          :disabled="prevDisabled"
          @click="focusedDate = clampToBounds(focusedDate.subtract({ months: 1 }))"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <h2 :id="titleId" :class="`${CLASS}__title`" aria-live="polite">
          {{ formatPlain(focusedDate, locale, { year: 'numeric', month: 'long' }) }}
        </h2>
        <button
          type="button"
          :class="`${CLASS}__nav`"
          aria-label="Next month"
          :disabled="nextDisabled"
          @click="focusedDate = clampToBounds(focusedDate.add({ months: 1 }))"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <table ref="gridRef" :class="`${CLASS}__grid`" :aria-labelledby="titleId">
        <thead>
          <tr>
            <th
              v-for="d in headerRow"
              :key="d.toString()"
              scope="col"
              :class="`${CLASS}__weekday`"
            >
              <abbr :title="formatPlain(d, locale, { weekday: 'long' })">
                {{ formatPlain(d, locale, { weekday: 'short' }) }}
              </abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="week in weeks" :key="week[0]?.toString()">
            <td v-for="date in week" :key="date.toString()">
              <button
                type="button"
                :data-date="date.toString()"
                :class="dayClass(date)"
                :tabindex="date.equals(focusedDate) ? 0 : -1"
                :aria-pressed="selected != null && date.equals(selected)"
                :aria-current="date.equals(todayDate) ? 'date' : undefined"
                :aria-disabled="!isSelectable(date) || undefined"
                :aria-label="
                  formatPlain(date, locale, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                "
                @click="selectDate(date)"
                @keydown="onGridKeyDown"
                @focus="focusedDate = date"
              >
                {{ date.day }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
