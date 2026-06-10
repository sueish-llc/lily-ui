<script lang="ts">
// no type exports needed for Carousel
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Carousel — a slideshow for cycling through items.
 *
 * Uses `aria-roledescription="carousel"`, labeled slides, and pauses
 * auto-advance on hover/focus. Respect users' reduced-motion preference by
 * leaving `interval` at 0 unless motion is wanted. Provide slides via the
 * `slides` array prop; render each with the `#slide` scoped slot (receives
 * `{ slide, index }`) or fall back to text.
 *
 * @example
 * ```vue
 * <Carousel :slides="images" :interval="5000">
 *   <template #slide="{ slide }"><img :src="slide" /></template>
 * </Carousel>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Slides to display. */
    slides: unknown[];
    /** Auto-advance interval in ms (0 disables). */
    interval?: number;
    /** Show prev/next controls. */
    controls?: boolean;
    /** Show slide indicators. */
    indicators?: boolean;
    /** Accessible label for the carousel. */
    label?: string;
  }>(),
  { interval: 0, controls: true, indicators: true, label: 'Carousel' },
);

defineSlots<{
  slide?: (props: { slide: unknown; index: number }) => unknown;
}>();

/** Active slide index; bind with `v-model:index`. */
const active = defineModel<number>('index', { default: 0 });

const id = useId();
const CLASS = 'lily-carousel';
const count = computed(() => props.slides.length);

const paused = ref(false);

function go(next: number): void {
  active.value = (next + count.value) % count.value;
}

// Auto-advance, referencing the latest active index without resetting the
// timer on every slide change.
let timer: ReturnType<typeof setInterval> | undefined;

function clear(): void {
  if (timer !== undefined) {
    clearInterval(timer);
    timer = undefined;
  }
}

watch(
  [() => props.interval, count],
  ([interval, c]) => {
    clear();
    if (interval <= 0 || c <= 1) return;
    timer = setInterval(() => {
      if (!paused.value) go(active.value + 1);
    }, interval);
  },
  { immediate: true },
);

onBeforeUnmount(clear);
</script>

<template>
  <div
    :class="cx(CLASS)"
    role="group"
    aria-roledescription="carousel"
    :aria-label="label"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div :class="`${CLASS}__viewport`" :style="{ transform: `translateX(-${active * 100}%)` }">
      <div
        v-for="(slide, i) in slides"
        :id="`${id}-slide-${i}`"
        :key="i"
        :class="`${CLASS}__slide`"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${i + 1} of ${count}`"
        :aria-hidden="i !== active"
      >
        <slot name="slide" :slide="slide" :index="i">{{ slide }}</slot>
      </div>
    </div>

    <template v-if="controls && count > 1">
      <button
        type="button"
        :class="`${CLASS}__control ${CLASS}__control--prev`"
        aria-label="Previous slide"
        @click="go(active - 1)"
      >
        <span aria-hidden="true">&lsaquo;</span>
      </button>
      <button
        type="button"
        :class="`${CLASS}__control ${CLASS}__control--next`"
        aria-label="Next slide"
        @click="go(active + 1)"
      >
        <span aria-hidden="true">&rsaquo;</span>
      </button>
    </template>

    <ul v-if="indicators && count > 1" :class="`${CLASS}__indicators`">
      <li v-for="(_, i) in slides" :key="i">
        <button
          type="button"
          :class="`${CLASS}__indicator`"
          :aria-label="`Go to slide ${i + 1}`"
          :aria-current="i === active || undefined"
          @click="active = i"
        />
      </li>
    </ul>
  </div>
</template>
