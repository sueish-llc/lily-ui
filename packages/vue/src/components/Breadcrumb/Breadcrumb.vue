<script lang="ts">
/** A single breadcrumb crumb. */
export interface BreadcrumbItem {
  /** Visible label. */
  label: string;
  /** Link target; omit for the current (last) page. */
  href?: string;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Breadcrumb — shows the current page's location in the hierarchy.
 *
 * Renders a `<nav>` landmark with an ordered list; the last item is marked
 * `aria-current="page"` and rendered as plain text.
 *
 * @example
 * ```vue
 * <Breadcrumb :items="[{ label: 'Home', href: '/' }, { label: 'Library' }]" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Ordered crumbs from root to current page. */
    items: BreadcrumbItem[];
    /** Divider glyph between crumbs. */
    divider?: string;
    /** Accessible label for the nav landmark. */
    label?: string;
  }>(),
  { divider: '/', label: 'Breadcrumb' },
);

const listStyle = computed(() => ({ '--lily-breadcrumb-divider': `'${props.divider}'` }));
</script>

<template>
  <nav :aria-label="label">
    <ol class="lily-breadcrumb" :style="listStyle">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="lily-breadcrumb__item"
        :aria-current="i === items.length - 1 ? 'page' : undefined"
      >
        <a v-if="item.href && i !== items.length - 1" class="lily-breadcrumb__link" :href="item.href">
          {{ item.label }}
        </a>
        <template v-else>{{ item.label }}</template>
      </li>
    </ol>
  </nav>
</template>
