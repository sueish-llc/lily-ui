<script lang="ts">
import type { BreakpointToken } from '../../tokens';

/** Breakpoint at which the container becomes width-capped, or `'fluid'`. */
export type ContainerWidth = Exclude<BreakpointToken, 'xs'> | 'fluid';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Container — centers page content and constrains its max width.
 *
 * @example
 * ```vue
 * <Container>…</Container>            <!-- responsive -->
 * <Container width="lg">…</Container> <!-- fluid until lg -->
 * <Container width="fluid">…</Container>
 * ```
 */
const props = defineProps<{
  /** Element/component to render as. */
  as?: string | object;
  /**
   * Cap behavior:
   * - omitted → responsive (caps step up at each breakpoint)
   * - a breakpoint (`'sm'`…`'2xl'`) → fluid until then, capped after
   * - `'fluid'` → always full width
   */
  width?: ContainerWidth;
}>();

const classes = computed(() => cx('lily-container', props.width && `lily-container--${props.width}`));
</script>

<template>
  <component :is="as ?? 'div'" :class="classes">
    <slot />
  </component>
</template>
