<script lang="ts">
import type { SpacingToken } from '../../tokens';

/** Horizontal + vertical gutter (spacing token). */
export type RowGutter = SpacingToken;
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Row — flex container for {@link Col}s in the 12-column grid.
 *
 * @example
 * ```vue
 * <Row gutter="4">
 *   <Col :span="6">left</Col>
 *   <Col :span="6">right</Col>
 * </Row>
 * ```
 */
const props = defineProps<{
  /** Element/component to render as. */
  as?: string | object;
  /** Horizontal + vertical gutter (spacing token). */
  gutter?: SpacingToken;
  /** Horizontal gutter only (overrides `gutter`). */
  gutterX?: SpacingToken;
  /** Vertical gutter only (overrides `gutter`). */
  gutterY?: SpacingToken;
}>();

const classes = computed(() =>
  cx(
    'lily-row',
    props.gutter && `lily-g-${props.gutter}`,
    props.gutterX && `lily-gx-${props.gutterX}`,
    props.gutterY && `lily-gy-${props.gutterY}`,
  ),
);
</script>

<template>
  <component :is="as ?? 'div'" :class="classes">
    <slot />
  </component>
</template>
