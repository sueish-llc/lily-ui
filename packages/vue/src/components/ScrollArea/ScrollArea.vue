<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * ScrollArea — a scroll container with a slim, themed scrollbar consistent
 * across browsers.
 *
 * @example
 * ```vue
 * <ScrollArea :max-height="240">…</ScrollArea>
 * ```
 */
const props = withDefaults(defineProps<{ axis?: 'both' | 'x' | 'y'; maxHeight?: number | string }>(), { axis: 'y' });
const mh = computed(() => (typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight));
</script>

<template>
  <div :class="cx('lily-scroll-area', axis !== 'both' && `lily-scroll-area--${axis}`)" :style="{ maxHeight: mh }">
    <slot />
  </div>
</template>
