<script lang="ts">
/** A named ratio or an explicit `[width, height]` pair. */
export type NamedRatio = '1x1' | '4x3' | '16x9' | '21x9';
export type RatioValue = NamedRatio | [number, number];
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

const NAMED: Record<NamedRatio, [number, number]> = {
  '1x1': [1, 1],
  '4x3': [4, 3],
  '16x9': [16, 9],
  '21x9': [21, 9],
};

/**
 * Ratio — maintains an aspect ratio for embedded content (iframe, video, img).
 *
 * @example
 * ```vue
 * <Ratio ratio="16x9"><iframe title="demo" src="…" /></Ratio>
 * <Ratio :ratio="[3, 2]"><img src="…" alt="" /></Ratio>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Aspect ratio. */
    ratio?: RatioValue;
  }>(),
  { ratio: '16x9' },
);

const inlineStyle = computed(() => {
  const [w, h] = Array.isArray(props.ratio) ? props.ratio : NAMED[props.ratio as NamedRatio];
  return { '--lily-aspect-ratio': `${(h / w) * 100}%` };
});
</script>

<template>
  <div :class="cx('lily-ratio')" :style="inlineStyle">
    <slot />
  </div>
</template>
