<script lang="ts">
export interface AccordionItem {
  /** Stable key for the item. */
  id: string;
  /** Header text shown in the trigger. */
  header: string;
  /** Panel content. */
  content: string;
  /** Disable this item. */
  disabled?: boolean;
}
</script>

<script setup lang="ts">
import { useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Accordion — vertically stacked, collapsible sections.
 *
 * Follows the WAI-ARIA accordion pattern: each header is a `<button>` with
 * `aria-expanded` + `aria-controls`, and each panel is a region labeled by its
 * header. Bind the open set with `v-model:open`.
 *
 * @example
 * ```vue
 * <Accordion :items="[{ id: 'a', header: 'A', content: '…' }]" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** The items to render. */
    items: AccordionItem[];
    /** Allow multiple panels open at once. */
    multiple?: boolean;
  }>(),
  { multiple: false },
);

/** Set of open item ids; bind with `v-model:open`. */
const openIds = defineModel<string[]>('open', { default: () => [] });

const baseId = useId();
const CLASS = 'lily-accordion';

function toggle(id: string): void {
  const isOpen = openIds.value.includes(id);
  if (props.multiple) {
    openIds.value = isOpen ? openIds.value.filter((x) => x !== id) : [...openIds.value, id];
  } else {
    openIds.value = isOpen ? [] : [id];
  }
}
</script>

<template>
  <div :class="cx(CLASS)">
    <div v-for="item in items" :key="item.id" :class="`${CLASS}__item`">
      <h3 :class="`${CLASS}__header`">
        <button
          :id="`${baseId}-${item.id}-trigger`"
          type="button"
          :class="`${CLASS}__trigger`"
          :aria-expanded="openIds.includes(item.id)"
          :aria-controls="`${baseId}-${item.id}-panel`"
          :disabled="item.disabled"
          @click="toggle(item.id)"
        >
          <span>{{ item.header }}</span>
          <span :class="`${CLASS}__trigger__icon`" aria-hidden="true">&#9662;</span>
        </button>
      </h3>
      <div
        :id="`${baseId}-${item.id}-panel`"
        role="region"
        :aria-labelledby="`${baseId}-${item.id}-trigger`"
        :class="`${CLASS}__panel`"
        :hidden="!openIds.includes(item.id)"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>
