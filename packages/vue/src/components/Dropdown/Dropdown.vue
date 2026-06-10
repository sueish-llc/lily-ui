<script lang="ts">
// no type exports needed for Dropdown
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { cx } from '../../utils/cx';
import { useDismiss } from '../../composables/interactions';

/**
 * Dropdown — a toggleable menu anchored to a trigger button.
 *
 * The trigger exposes `aria-haspopup="menu"` and `aria-expanded`; the menu uses
 * `role="menu"` with `role="menuitem"` children (use `DropdownItem` /
 * `DropdownDivider`). Closes on Escape or outside click. Bind open state with
 * `v-model:open`.
 *
 * @example
 * ```vue
 * <Dropdown trigger="Options">
 *   <DropdownItem @click="…">Edit</DropdownItem>
 *   <DropdownDivider />
 *   <DropdownItem @click="…">Delete</DropdownItem>
 * </Dropdown>
 * ```
 */
withDefaults(
  defineProps<{
    /** The trigger element label (or use the `#trigger` slot). */
    trigger?: string;
    /** Align the menu to the end (right) edge. */
    alignEnd?: boolean;
  }>(),
  { alignEnd: false },
);

/** Open state; bind with `v-model:open`. */
const open = defineModel<boolean>('open', { default: false });

const rootRef = ref<HTMLDivElement | null>(null);
const CLASS = 'lily-dropdown';

useDismiss(rootRef, open, () => (open.value = false));
</script>

<template>
  <div ref="rootRef" :class="cx(CLASS)">
    <button
      type="button"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      <slot name="trigger">{{ trigger }}</slot>
    </button>
    <ul
      :class="cx(`${CLASS}__menu`, alignEnd && `${CLASS}__menu--end`, 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy')"
      role="menu"
      :hidden="!open"
    >
      <slot />
    </ul>
  </div>
</template>
