<script lang="ts">
import { getDateTimeFormat, toUtcDate } from '../../utils/datetime';

/** Clamp `ym` into the inclusive `[min, max]` range. */
export function clampYearMonth(
  ym: Temporal.PlainYearMonth,
  min: Temporal.PlainYearMonth | undefined,
  max: Temporal.PlainYearMonth | undefined,
): Temporal.PlainYearMonth {
  if (min && Temporal.PlainYearMonth.compare(ym, min) < 0) return min;
  if (max && Temporal.PlainYearMonth.compare(ym, max) > 0) return max;
  return ym;
}

/** Localized month label via a fixed-UTC `Date`; the logic stays in Temporal. */
export function formatMonth(
  ym: Temporal.PlainYearMonth,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  const utc = toUtcDate(ym.year, ym.month, 1);
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(utc);
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue';
import { cx } from '../../utils/cx';
import { toPlainYearMonth, type PlainYearMonthInput } from '../../utils/datetime';
import { useDismiss } from '../../composables/interactions';

const CLASS = 'lily-month-picker';

/**
 * MonthPicker — pick a calendar month from a 12-month grid with prev/next year
 * navigation. The value is a `Temporal.PlainYearMonth`. Supports `v-model`.
 *
 * @example
 * ```vue
 * <MonthPicker v-model="month" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    min?: PlainYearMonthInput;
    max?: PlainYearMonthInput;
    locale?: Intl.LocalesArgument;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    alignEnd?: boolean;
    toggleLabel?: string;
    id?: string;
  }>(),
  { disabled: false, size: 'md', alignEnd: false, toggleLabel: 'Choose month' },
);

/** Selected month; bind with `v-model`. Pass `null` for "no selection". */
const selected = defineModel<Temporal.PlainYearMonth | null>({ default: null });

const reactId = useId();
const baseId = computed(() => props.id ?? reactId);
const popupId = computed(() => `${baseId.value}-popup`);
const titleId = computed(() => `${baseId.value}-title`);

const rootRef = ref<HTMLDivElement | null>(null);
const toggleRef = ref<HTMLButtonElement | null>(null);
const gridRef = ref<HTMLDivElement | null>(null);
let focusCell = false;

const minYm = computed(() => toBound(props.min));
const maxYm = computed(() => toBound(props.max));

const nowYm = () => Temporal.Now.plainDateISO().toPlainYearMonth();

const open = ref(false);
const viewYear = ref<number>((selected.value ?? nowYm()).year);
const focused = ref<Temporal.PlainYearMonth>(
  selected.value ?? clampYearMonth(nowYm(), minYm.value, maxYm.value),
);

function toBound(input: PlainYearMonthInput | undefined): Temporal.PlainYearMonth | undefined {
  return input == null ? undefined : toPlainYearMonth(input);
}

function isSelectable(ym: Temporal.PlainYearMonth): boolean {
  if (minYm.value && Temporal.PlainYearMonth.compare(ym, minYm.value) < 0) return false;
  if (maxYm.value && Temporal.PlainYearMonth.compare(ym, maxYm.value) > 0) return false;
  return true;
}

function clampToBounds(ym: Temporal.PlainYearMonth): Temporal.PlainYearMonth {
  return clampYearMonth(ym, minYm.value, maxYm.value);
}

function moveFocus(ym: Temporal.PlainYearMonth) {
  const next = clampToBounds(ym);
  focusCell = true;
  focused.value = next;
  viewYear.value = next.year;
}

function openPopup() {
  if (props.disabled) return;
  const start = clampToBounds(selected.value ?? nowYm());
  focusCell = true;
  focused.value = start;
  viewYear.value = start.year;
  open.value = true;
}

function closePopup(returnFocus: boolean) {
  open.value = false;
  if (returnFocus) toggleRef.value?.focus();
}

function selectMonth(ym: Temporal.PlainYearMonth) {
  if (!isSelectable(ym)) return;
  selected.value = ym;
  focused.value = ym;
  closePopup(true);
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

watch([open, focused, viewYear], async () => {
  if (!open.value || !focusCell) return;
  focusCell = false;
  await nextTick();
  const el = gridRef.value?.querySelector<HTMLButtonElement>(
    `[data-month="${focused.value.toString()}"]`,
  );
  el?.focus();
});

const months = computed(() =>
  Array.from({ length: 12 }, (_, i) =>
    Temporal.PlainYearMonth.from({ year: viewYear.value, month: i + 1 }),
  ),
);

const prevDisabled = computed(() => minYm.value != null && viewYear.value <= minYm.value.year);
const nextDisabled = computed(() => maxYm.value != null && viewYear.value >= maxYm.value.year);

const triggerText = computed(() =>
  selected.value
    ? formatMonth(selected.value, props.locale, { year: 'numeric', month: 'long' })
    : props.toggleLabel,
);

function onGridKeyDown(e: KeyboardEvent) {
  const f = focused.value;
  switch (e.key) {
    case 'ArrowLeft':
      moveFocus(f.subtract({ months: 1 }));
      break;
    case 'ArrowRight':
      moveFocus(f.add({ months: 1 }));
      break;
    case 'ArrowUp':
      moveFocus(f.subtract({ months: 3 }));
      break;
    case 'ArrowDown':
      moveFocus(f.add({ months: 3 }));
      break;
    case 'Home':
      moveFocus(f.subtract({ months: (f.month - 1) % 3 }));
      break;
    case 'End':
      moveFocus(f.add({ months: 2 - ((f.month - 1) % 3) }));
      break;
    case 'PageUp':
      moveFocus(f.subtract({ years: 1 }));
      break;
    case 'PageDown':
      moveFocus(f.add({ years: 1 }));
      break;
    case 'Enter':
    case ' ':
      selectMonth(f);
      break;
    default:
      return;
  }
  e.preventDefault();
}

function onTriggerKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    openPopup();
  }
}
</script>

<template>
  <div
    ref="rootRef"
    :class="cx(CLASS, `${CLASS}--${size}`, disabled && `${CLASS}--disabled`)"
  >
    <button
      :id="baseId"
      ref="toggleRef"
      type="button"
      :class="`${CLASS}__trigger`"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? popupId : undefined"
      :aria-label="selected ? `${toggleLabel}: ${triggerText}` : toggleLabel"
      :disabled="disabled"
      @click="open ? closePopup(false) : openPopup()"
      @keydown="onTriggerKeyDown"
    >
      <span :class="cx(`${CLASS}__value`, !selected && `${CLASS}__value--placeholder`)">
        {{ triggerText }}
      </span>
      <span :class="`${CLASS}__icon`">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.7" />
          <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
      </span>
    </button>

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
          aria-label="Previous year"
          :disabled="prevDisabled"
          @click="viewYear -= 1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <h2 :id="titleId" :class="`${CLASS}__title`" aria-live="polite">{{ viewYear }}</h2>
        <button
          type="button"
          :class="`${CLASS}__nav`"
          aria-label="Next year"
          :disabled="nextDisabled"
          @click="viewYear += 1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div ref="gridRef" role="group" :aria-labelledby="titleId" :class="`${CLASS}__grid`">
        <button
          v-for="ym in months"
          :key="ym.toString()"
          type="button"
          :data-month="ym.toString()"
          :class="
            cx(`${CLASS}__month`, {
              [`${CLASS}__month--selected`]: selected != null && ym.equals(selected),
            })
          "
          :tabindex="ym.equals(focused) ? 0 : -1"
          :aria-pressed="selected != null && ym.equals(selected)"
          :aria-disabled="!isSelectable(ym) || undefined"
          :aria-label="formatMonth(ym, locale, { year: 'numeric', month: 'long' })"
          @click="selectMonth(ym)"
          @keydown="onGridKeyDown"
          @focus="focused = ym"
        >
          {{ formatMonth(ym, locale, { month: 'short' }) }}
        </button>
      </div>
    </div>
  </div>
</template>
