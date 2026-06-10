<script lang="ts">
import { getDateTimeFormat, toUtcDate } from '../../utils/datetime';

/** Day-of-week the calendar grid starts on: 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** Clamp `date` into the date range implied by the `[min, max]` bounds. */
export function clampDate(
  date: Temporal.PlainDate,
  min: Temporal.PlainDateTime | undefined,
  max: Temporal.PlainDateTime | undefined,
): Temporal.PlainDate {
  if (min && Temporal.PlainDate.compare(date, min.toPlainDate()) < 0) return min.toPlainDate();
  if (max && Temporal.PlainDate.compare(date, max.toPlainDate()) > 0) return max.toPlainDate();
  return date;
}

/** Column (0-6) of `date` within a week starting on `weekStartsOn`. */
export function columnIndex(date: Temporal.PlainDate, weekStartsOn: Weekday): number {
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

/** Localized day label via a fixed-UTC `Date`; the logic stays in Temporal. */
export function formatDay(
  date: Temporal.PlainDate,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  const utc = toUtcDate(date.year, date.month, date.day);
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(utc);
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue';
import { cx } from '../../utils/cx';
import { today, toPlainDateTime, type PlainDateTimeInput } from '../../utils/datetime';
import { useDismiss } from '../../composables/interactions';

const CLASS = 'lily-date-time-picker';

/**
 * DateTimePicker — an accessible, Temporal-powered picker that combines a month
 * calendar with hour/minute steppers. The value is a `Temporal.PlainDateTime`.
 * Supports `v-model`.
 *
 * @example
 * ```vue
 * <DateTimePicker v-model="when" :minute-step="15" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    min?: PlainDateTimeInput;
    max?: PlainDateTimeInput;
    locale?: Intl.LocalesArgument;
    weekStartsOn?: Weekday;
    minuteStep?: number;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    status?: 'danger';
    alignEnd?: boolean;
    toggleLabel?: string;
    id?: string;
    name?: string;
  }>(),
  {
    weekStartsOn: 1,
    minuteStep: 5,
    disabled: false,
    size: 'md',
    alignEnd: false,
    toggleLabel: 'Choose date and time',
  },
);

/** Selected date+time; bind with `v-model`. Pass `null` for "no selection". */
const selected = defineModel<Temporal.PlainDateTime | null>({ default: null });

const reactId = useId();
const baseId = computed(() => props.id ?? reactId);
const popupId = computed(() => `${baseId.value}-popup`);
const titleId = computed(() => `${baseId.value}-title`);

const rootRef = ref<HTMLDivElement | null>(null);
const toggleRef = ref<HTMLButtonElement | null>(null);
const gridRef = ref<HTMLTableElement | null>(null);
let focusDay = false;

const minDt = computed(() => toBound(props.min));
const maxDt = computed(() => toBound(props.max));

const open = ref(false);
const todayDate = ref(today());
const draftTime = ref<Temporal.PlainTime>(
  selected.value ? selected.value.toPlainTime() : Temporal.PlainTime.from({ hour: 0, minute: 0 }),
);
const focusedDate = ref<Temporal.PlainDate>(
  clampDate(selected.value ? selected.value.toPlainDate() : todayDate.value, minDt.value, maxDt.value),
);

function toBound(input: PlainDateTimeInput | undefined): Temporal.PlainDateTime | undefined {
  return input == null ? undefined : toPlainDateTime(input);
}

const selectedIso = computed(() => (selected.value ? selected.value.toString() : ''));
watch(selectedIso, () => {
  if (selected.value) draftTime.value = selected.value.toPlainTime();
});

function isSelectable(date: Temporal.PlainDate): boolean {
  if (minDt.value && Temporal.PlainDate.compare(date, minDt.value.toPlainDate()) < 0) return false;
  if (maxDt.value && Temporal.PlainDate.compare(date, maxDt.value.toPlainDate()) > 0) return false;
  return true;
}

function clampDateToBounds(date: Temporal.PlainDate): Temporal.PlainDate {
  return clampDate(date, minDt.value, maxDt.value);
}

function moveFocus(date: Temporal.PlainDate) {
  focusDay = true;
  focusedDate.value = clampDateToBounds(date);
}

function openPopup() {
  if (props.disabled) return;
  const now = today();
  todayDate.value = now;
  focusDay = true;
  focusedDate.value = clampDateToBounds(selected.value ? selected.value.toPlainDate() : now);
  open.value = true;
}

function closePopup(returnFocus: boolean) {
  open.value = false;
  if (returnFocus) toggleRef.value?.focus();
}

function commit(date: Temporal.PlainDate, time: Temporal.PlainTime, close: boolean) {
  let next = date.toPlainDateTime(time);
  if (minDt.value && Temporal.PlainDateTime.compare(next, minDt.value) < 0) next = minDt.value;
  if (maxDt.value && Temporal.PlainDateTime.compare(next, maxDt.value) > 0) next = maxDt.value;
  selected.value = next;
  draftTime.value = next.toPlainTime();
  focusedDate.value = next.toPlainDate();
  if (close) closePopup(true);
}

function selectDate(date: Temporal.PlainDate) {
  if (!isSelectable(date)) return;
  commit(date, draftTime.value, false);
}

function changeTime(time: Temporal.PlainTime) {
  draftTime.value = time;
  const base = selected.value ? selected.value.toPlainDate() : focusedDate.value;
  commit(base, time, false);
}

useDismiss(rootRef, open, () => (open.value = false), { escape: false });

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
    minDt.value != null &&
    Temporal.PlainYearMonth.compare(viewMonth.value, minDt.value.toPlainDate().toPlainYearMonth()) <= 0,
);
const nextDisabled = computed(
  () =>
    maxDt.value != null &&
    Temporal.PlainYearMonth.compare(viewMonth.value, maxDt.value.toPlainDate().toPlainYearMonth()) >= 0,
);

const minutes = computed(() =>
  Array.from({ length: Math.ceil(60 / props.minuteStep) }, (_, i) => i * props.minuteStep),
);
const hours = Array.from({ length: 24 }, (_, i) => i);

const fieldText = computed(() =>
  selected.value
    ? `${selected.value.toPlainDate().toString()} ${pad2(selected.value.hour)}:${pad2(selected.value.minute)}`
    : '',
);

function onGridKeyDown(e: KeyboardEvent) {
  const f = focusedDate.value;
  switch (e.key) {
    case 'ArrowLeft':
      moveFocus(f.subtract({ days: 1 }));
      break;
    case 'ArrowRight':
      moveFocus(f.add({ days: 1 }));
      break;
    case 'ArrowUp':
      moveFocus(f.subtract({ days: 7 }));
      break;
    case 'ArrowDown':
      moveFocus(f.add({ days: 7 }));
      break;
    case 'Home':
      moveFocus(f.subtract({ days: columnIndex(f, props.weekStartsOn) }));
      break;
    case 'End':
      moveFocus(f.add({ days: 6 - columnIndex(f, props.weekStartsOn) }));
      break;
    case 'PageUp':
      moveFocus(f.subtract(e.shiftKey ? { years: 1 } : { months: 1 }));
      break;
    case 'PageDown':
      moveFocus(f.add(e.shiftKey ? { years: 1 } : { months: 1 }));
      break;
    case 'Enter':
    case ' ':
      selectDate(f);
      break;
    default:
      return;
  }
  e.preventDefault();
}

function onInputKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'Enter') {
    e.preventDefault();
    openPopup();
  }
}

function dayClass(date: Temporal.PlainDate): string {
  const inMonth = date.month === viewMonth.value.month;
  const isSelected = selected.value != null && date.equals(selected.value.toPlainDate());
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
        `${CLASS}--${size}`,
        status === 'danger' && `${CLASS}--invalid`,
        disabled && `${CLASS}--disabled`,
      )
    "
  >
    <div :class="`${CLASS}__field`">
      <input
        :id="baseId"
        :name="name"
        type="text"
        readonly
        autocomplete="off"
        :class="`${CLASS}__input`"
        placeholder="YYYY-MM-DD HH:MM"
        :value="fieldText"
        :disabled="disabled"
        :aria-invalid="status === 'danger' || undefined"
        @click="open ? undefined : openPopup()"
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
          @click="focusedDate = clampDateToBounds(focusedDate.subtract({ months: 1 }))"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <h2 :id="titleId" :class="`${CLASS}__title`" aria-live="polite">
          {{ formatDay(focusedDate, locale, { year: 'numeric', month: 'long' }) }}
        </h2>
        <button
          type="button"
          :class="`${CLASS}__nav`"
          aria-label="Next month"
          :disabled="nextDisabled"
          @click="focusedDate = clampDateToBounds(focusedDate.add({ months: 1 }))"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <table ref="gridRef" :class="`${CLASS}__grid`" :aria-labelledby="titleId">
        <thead>
          <tr>
            <th v-for="d in headerRow" :key="d.toString()" scope="col" :class="`${CLASS}__weekday`">
              <abbr :title="formatDay(d, locale, { weekday: 'long' })">
                {{ formatDay(d, locale, { weekday: 'short' }) }}
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
                :aria-pressed="selected != null && date.equals(selected.toPlainDate())"
                :aria-current="date.equals(todayDate) ? 'date' : undefined"
                :aria-disabled="!isSelectable(date) || undefined"
                :aria-label="
                  formatDay(date, locale, {
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

      <div :class="`${CLASS}__time`">
        <select
          class="lily-select"
          aria-label="Hour"
          :value="draftTime.hour"
          @change="changeTime(draftTime.with({ hour: Number(($event.target as HTMLSelectElement).value) }))"
        >
          <option v-for="hr in hours" :key="hr" :value="hr">{{ pad2(hr) }}</option>
        </select>
        <span :class="`${CLASS}__time-sep`" aria-hidden="true">:</span>
        <select
          class="lily-select"
          aria-label="Minute"
          :value="draftTime.minute"
          @change="changeTime(draftTime.with({ minute: Number(($event.target as HTMLSelectElement).value) }))"
        >
          <option v-for="mn in minutes" :key="mn" :value="mn">{{ pad2(mn) }}</option>
        </select>
      </div>
    </div>
  </div>
</template>
