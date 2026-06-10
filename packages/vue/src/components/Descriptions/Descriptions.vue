<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Descriptions — a key/value definition list rendered as `<dl>`.
 * Compose with `DescriptionsItem` children.
 *
 * @example
 * ```vue
 * <Descriptions :columns="2" bordered>
 *   <DescriptionsItem term="Name">Lily UI</DescriptionsItem>
 *   <DescriptionsItem term="Version">1.0.0</DescriptionsItem>
 * </Descriptions>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Number of columns (pairs per row). */
    columns?: 1 | 2 | 3;
    /** Layout direction. */
    layout?: 'horizontal' | 'vertical';
    /** Show a bordered grid. */
    bordered?: boolean;
  }>(),
  {
    columns: 1,
    layout: 'horizontal',
    bordered: false,
  },
);

const classes = computed(() =>
  cx(
    'lily-descriptions',
    `lily-descriptions--${props.layout}`,
    `lily-descriptions--cols-${props.columns}`,
    props.bordered && 'lily-descriptions--bordered',
  ),
);
</script>

<template>
  <dl :class="classes">
    <slot />
  </dl>
</template>
