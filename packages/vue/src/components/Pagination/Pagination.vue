<script lang="ts">
// no type exports needed for Pagination
</script>

<script setup lang="ts">
import { computed } from 'vue';

/** Build the visible page list with `'…'` gaps — ported exactly from React. */
function buildPages(count: number, page: number, windowSize: number): (number | 'gap')[] {
  if (count <= windowSize) return Array.from({ length: count }, (_, i) => i + 1);

  const side = Math.max(1, Math.floor((windowSize - 3) / 2));
  const pages: (number | 'gap')[] = [1];
  const start = Math.max(2, page - side);
  const end = Math.min(count - 1, page + side);

  if (start > 2) pages.push('gap');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < count - 1) pages.push('gap');
  pages.push(count);
  return pages;
}

/**
 * Pagination — accessible page navigation.
 *
 * Renders a `<nav>` + list of buttons; the current page is `aria-current`,
 * and disabled arrows are `aria-disabled`. Use `v-model:page` for two-way
 * binding or listen to `update:page`.
 *
 * @example
 * ```vue
 * <Pagination v-model:page="page" :count="10" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Total number of pages. */
    count: number;
    /** Max number of numbered buttons to show (window). */
    siblingWindow?: number;
    /** Show previous/next arrows. */
    showArrows?: boolean;
    /** Accessible label for the nav landmark. */
    label?: string;
  }>(),
  {
    siblingWindow: 7,
    showArrows: true,
    label: 'Pagination',
  },
);

/** Current page (1-based); bind with `v-model:page`. */
const page = defineModel<number>('page', { required: true });

const CLASS = 'lily-pagination';

const pages = computed(() => buildPages(props.count, page.value, props.siblingWindow));
const atStart = computed(() => page.value <= 1);
const atEnd = computed(() => page.value >= props.count);

function activate(p: number): void {
  page.value = p;
}
</script>

<template>
  <nav :aria-label="label">
    <ul :class="CLASS">
      <li v-if="showArrows" :class="`${CLASS}__item`">
        <button
          type="button"
          :class="`${CLASS}__link`"
          aria-label="Previous page"
          :aria-disabled="atStart || undefined"
          :disabled="atStart"
          @click="!atStart && activate(page - 1)"
        >
          &lsaquo;
        </button>
      </li>

      <template v-for="(p, i) in pages" :key="p === 'gap' ? `gap-${i}` : p">
        <li v-if="p === 'gap'" :class="`${CLASS}__item`" aria-hidden="true">
          <span :class="`${CLASS}__link`" aria-disabled="true">&hellip;</span>
        </li>
        <li
          v-else
          :class="`${CLASS}__item`"
          v-bind="p === page ? { 'aria-current': 'page' } : {}"
        >
          <button
            type="button"
            :class="`${CLASS}__link`"
            :aria-label="`Page ${p}`"
            @click="activate(p)"
          >
            {{ p }}
          </button>
        </li>
      </template>

      <li v-if="showArrows" :class="`${CLASS}__item`">
        <button
          type="button"
          :class="`${CLASS}__link`"
          aria-label="Next page"
          :aria-disabled="atEnd || undefined"
          :disabled="atEnd"
          @click="!atEnd && activate(page + 1)"
        >
          &rsaquo;
        </button>
      </li>
    </ul>
  </nav>
</template>
