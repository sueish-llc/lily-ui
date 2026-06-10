<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';
import type { SpacingToken } from '../../tokens';

/**
 * Stack — one-dimensional flex layout with a consistent gap.
 *
 * @example
 * ```vue
 * <Stack gap="4">…</Stack>                        <!-- vertical -->
 * <Stack direction="horizontal" gap="2">…</Stack> <!-- horizontal -->
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Element/component to render as. */
    as?: string | object;
    /** Layout direction. */
    direction?: 'vertical' | 'horizontal';
    /** Gap between children (spacing token). */
    gap?: SpacingToken;
  }>(),
  { direction: 'vertical', gap: '3' },
);

const classes = computed(() => {
  const base = props.direction === 'horizontal' ? 'lily-hstack' : 'lily-vstack';
  return cx(base, `lily-gap-${props.gap}`);
});
</script>

<template>
  <component :is="as ?? 'div'" :class="classes">
    <slot />
  </component>
</template>
