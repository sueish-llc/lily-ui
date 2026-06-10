<script lang="ts">
export type SkeletonVariant = 'text' | 'circle' | 'rect';
const dim = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v);
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Skeleton — a shimmering placeholder for loading content. Decorative
 * (`aria-hidden`); the shimmer is disabled under reduced motion.
 *
 * @example
 * ```vue
 * <Skeleton variant="circle" :width="40" :height="40" />
 * <Skeleton :lines="3" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    variant?: SkeletonVariant;
    width?: number | string;
    height?: number | string;
    lines?: number;
    animated?: boolean;
  }>(),
  { variant: 'text', animated: true },
);

const multiline = computed(() => props.variant === 'text' && !!props.lines && props.lines > 1);
const singleClass = computed(() =>
  cx('lily-skeleton', `lily-skeleton--${props.variant}`, props.animated && 'lily-skeleton--animated'),
);
const singleStyle = computed(() => ({ width: dim(props.width), height: dim(props.height) }));
</script>

<template>
  <div v-if="multiline" aria-hidden="true">
    <span
      v-for="i in lines"
      :key="i"
      :class="cx('lily-skeleton', 'lily-skeleton--text', animated && 'lily-skeleton--animated')"
      :style="{ width: i === lines ? '70%' : dim(width) ?? '100%' }"
    />
  </div>
  <span v-else :class="singleClass" :style="singleStyle" aria-hidden="true" />
</template>
