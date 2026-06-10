<script lang="ts">
export type DividerOrientation = 'horizontal' | 'vertical';
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Divider — a separator rule. Horizontal by default; can be vertical (inside a
 * flex row) or carry a centered label (default slot).
 *
 * @example
 * ```vue
 * <Divider />
 * <Divider>または</Divider>
 * <Divider orientation="vertical" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Orientation. */
    orientation?: DividerOrientation;
    /** Use the stronger border color. */
    strong?: boolean;
    /** Horizontal alignment of the label, if any. */
    align?: 'start' | 'center' | 'end';
  }>(),
  { orientation: 'horizontal', strong: false, align: 'center' },
);

const slots = useSlots();
const labeled = computed(() => !!slots.default && props.orientation === 'horizontal');

const classes = computed(() =>
  cx(
    'lily-divider',
    props.orientation === 'vertical' && 'lily-divider--vertical',
    props.strong && 'lily-divider--strong',
    labeled.value && 'lily-divider--labeled',
    labeled.value && props.align !== 'center' && `lily-divider--${props.align}`,
  ),
);
</script>

<template>
  <div
    :class="classes"
    role="separator"
    :aria-orientation="orientation === 'vertical' ? 'vertical' : undefined"
  >
    <span v-if="labeled"><slot /></span>
  </div>
</template>
