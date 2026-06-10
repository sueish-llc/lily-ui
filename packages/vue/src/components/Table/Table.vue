<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Table — accessible data table.
 *
 * Compose with native `<thead>/<tbody>/<tr>/<th>/<td>`. Provide a `caption`
 * (or `<th scope>` headers) so the table is understandable to screen readers.
 *
 * @example
 * ```vue
 * <Table striped hover caption="Users">
 *   <thead><tr><th scope="col">Name</th></tr></thead>
 *   <tbody><tr><td>Ada</td></tr></tbody>
 * </Table>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Zebra-striped rows. */
    striped?: boolean;
    /** Highlight rows on hover. */
    hover?: boolean;
    /** Bordered cells. */
    bordered?: boolean;
    /** Compact padding. */
    size?: 'sm' | 'md';
    /** Wrap in a horizontally scrollable container for narrow viewports. */
    responsive?: boolean;
    /** Accessible caption describing the table contents. */
    caption?: string;
  }>(),
  { size: 'md', striped: false, hover: false, bordered: false, responsive: false },
);

const tableClasses = computed(() =>
  cx(
    'lily-table',
    props.striped && 'lily-table--striped',
    props.hover && 'lily-table--hover',
    props.bordered && 'lily-table--bordered',
    props.size === 'sm' && 'lily-table--sm',
  ),
);
</script>

<template>
  <div v-if="responsive" class="lily-table-responsive">
    <table :class="tableClasses">
      <caption v-if="caption">{{ caption }}</caption>
      <slot />
    </table>
  </div>
  <table v-else :class="tableClasses">
    <caption v-if="caption">{{ caption }}</caption>
    <slot />
  </table>
</template>
