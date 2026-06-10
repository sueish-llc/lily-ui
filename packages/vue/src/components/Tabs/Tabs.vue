<script lang="ts">
export interface TabItem {
  /** Stable id for the tab. */
  id: string;
  /** Tab label. */
  label: string;
  /** Panel content. */
  content: string;
  /** Disable this tab. */
  disabled?: boolean;
}

/** Visual style. */
export type TabsVariant = 'tabs' | 'pills';
</script>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Tabs — an accessible tabbed interface (WAI-ARIA tabs pattern).
 *
 * Arrow keys move between tabs (roving focus); Home/End jump to first/last.
 * Each panel is associated with its tab via `aria-labelledby`/`aria-controls`.
 * Bind the active tab with `v-model`.
 *
 * @example
 * ```vue
 * <Tabs label="Settings" :items="[{ id: 'a', label: 'A', content: '…' }]" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Tabs to render. */
    items: TabItem[];
    /** Visual style. */
    variant?: TabsVariant;
    /** Accessible label for the tablist. */
    label?: string;
  }>(),
  { variant: 'tabs' },
);

/** Active tab id; bind with `v-model`. Defaults to the first tab. */
const model = defineModel<string>();

const baseId = useId();
const CLASS = 'lily-nav';

const active = computed(() => model.value ?? props.items[0]?.id ?? '');

const enabled = computed(() => props.items.filter((t) => !t.disabled));

const tabRefs = new Map<string, HTMLButtonElement>();
function setTabRef(id: string, el: HTMLButtonElement | null): void {
  if (el) tabRefs.set(id, el);
  else tabRefs.delete(id);
}

function onKeyDown(e: KeyboardEvent, currentId: string): void {
  const list = enabled.value;
  const idx = list.findIndex((t) => t.id === currentId);
  if (idx === -1) return;
  let nextIdx: number | null = null;
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIdx = (idx + 1) % list.length;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIdx = (idx - 1 + list.length) % list.length;
      break;
    case 'Home':
      nextIdx = 0;
      break;
    case 'End':
      nextIdx = list.length - 1;
      break;
    default:
      return;
  }
  e.preventDefault();
  const next = list[nextIdx];
  if (next) {
    model.value = next.id;
    tabRefs.get(next.id)?.focus();
  }
}
</script>

<template>
  <div>
    <div role="tablist" :aria-label="label" :class="cx(CLASS, `${CLASS}--${variant}`)">
      <button
        v-for="tab in items"
        :id="`${baseId}-${tab.id}-tab`"
        :key="tab.id"
        :ref="(el) => setTabRef(tab.id, el as HTMLButtonElement | null)"
        type="button"
        role="tab"
        :class="`${CLASS}__link`"
        :aria-selected="tab.id === active"
        :aria-controls="`${baseId}-${tab.id}-panel`"
        :aria-disabled="tab.disabled || undefined"
        :tabindex="tab.id === active ? 0 : -1"
        :disabled="tab.disabled"
        @click="!tab.disabled && (model = tab.id)"
        @keydown="onKeyDown($event, tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div
      v-for="tab in items"
      :id="`${baseId}-${tab.id}-panel`"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="`${baseId}-${tab.id}-tab`"
      class="lily-tab-panel"
      :hidden="tab.id !== active"
      :tabindex="0"
    >
      {{ tab.content }}
    </div>
  </div>
</template>
