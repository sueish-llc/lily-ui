<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { cx } from '../../utils/cx';
import { formatRelative, toInstant, type InstantInput } from '../../utils/datetime';

/**
 * RelativeTime — renders a `<time>` element with human-readable relative text
 * such as "3分前" or "in 2 hours". Backed by `Intl.RelativeTimeFormat` and
 * the Temporal API. When `live` is true the component ticks on `updateInterval`
 * (default 30 s) to stay current.
 *
 * @example
 * ```vue
 * <RelativeTime :value="someInstant" live />
 * <RelativeTime value="2026-01-01" locale="ja" numeric="always" />
 * ```
 */
export type RelativeTimeValue =
  | Temporal.PlainDate
  | Temporal.PlainDateTime
  | Temporal.ZonedDateTime
  | Temporal.Instant
  | string;

const props = withDefaults(
  defineProps<{
    value: RelativeTimeValue;
    base?: RelativeTimeValue;
    locale?: string;
    numeric?: 'auto' | 'always';
    live?: boolean;
    updateInterval?: number;
    class?: string;
  }>(),
  { numeric: 'auto', live: false, updateInterval: 30_000 },
);

const tick = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

function clearTimer() {
  if (intervalId !== null) { clearInterval(intervalId); intervalId = null; }
}

function startTimer() {
  clearTimer();
  if (!props.live) return;
  // Guard against `updateInterval <= 0`, which would make setInterval spin
  // as fast as the event loop allows. Sub-second ticks are pointless for
  // relative text anyway (the finest unit is seconds).
  intervalId = setInterval(() => { tick.value++; }, Math.max(1000, props.updateInterval));
}

// `live` / `updateInterval` can change after mount; rebuild the timer to match
// (the React version includes both in its effect deps).
watch(() => [props.live, props.updateInterval] as const, () => startTimer());

onMounted(() => startTimer());
onUnmounted(() => clearTimer());

const text = computed(() => {
  // Referencing tick.value makes this reactive to live updates.
  void tick.value;
  const now = props.base !== undefined ? (props.base as InstantInput) : Temporal.Now.instant();
  return formatRelative(props.value as InstantInput, now, props.locale, props.numeric);
});

const iso = computed((): string => {
  const v = props.value;
  if (typeof v === 'string') return v;
  return toInstant(v as InstantInput).toString();
});

const classes = computed(() => cx('lily-relative-time', props.class));
</script>

<template>
  <time :dateTime="iso" :class="classes">{{ text }}</time>
</template>
