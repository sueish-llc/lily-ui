<script setup lang="ts">
import { ref } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Toolbar — a single-tab-stop group of controls with a roving tabindex.
 *
 * Implements `role="toolbar"` with the WAI-ARIA keyboard model: Arrow keys move
 * focus between items; Home/End jump to first/last. Only one item is in the tab
 * sequence at a time (roving tabindex).
 *
 * @example
 * ```vue
 * <Toolbar aria-label="Text formatting">
 *   <Button variant="ghost" size="sm">Bold</Button>
 *   <Button variant="ghost" size="sm">Italic</Button>
 * </Toolbar>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Layout direction; maps to `aria-orientation`. */
    orientation?: 'horizontal' | 'vertical';
    /** Accessible label for the toolbar. */
    'aria-label': string;
  }>(),
  { orientation: 'horizontal' },
);

const toolbarRef = ref<HTMLDivElement | null>(null);

const CLASS = 'lily-toolbar';

const getFocusableItems = (): HTMLElement[] => {
  const node = toolbarRef.value;
  if (!node) return [];
  return Array.from(
    node.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [role="button"]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"]):not([disabled])',
    ),
  ).filter((el) => el.closest('[role="toolbar"]') === node);
};

const onKeyDown = (e: KeyboardEvent) => {
  const items = getFocusableItems();
  if (items.length === 0) return;

  const currentIdx = items.findIndex((el) => el === document.activeElement);
  const isHorizontal = props.orientation === 'horizontal';

  let nextIdx: number | null = null;

  switch (e.key) {
    case isHorizontal ? 'ArrowRight' : 'ArrowDown':
      nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % items.length;
      break;
    case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
      nextIdx =
        currentIdx === -1
          ? items.length - 1
          : (currentIdx - 1 + items.length) % items.length;
      break;
    case isHorizontal ? 'ArrowDown' : 'ArrowRight':
      nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % items.length;
      break;
    case isHorizontal ? 'ArrowUp' : 'ArrowLeft':
      nextIdx =
        currentIdx === -1
          ? items.length - 1
          : (currentIdx - 1 + items.length) % items.length;
      break;
    case 'Home':
      nextIdx = 0;
      break;
    case 'End':
      nextIdx = items.length - 1;
      break;
    default:
      return;
  }

  if (nextIdx !== null) {
    e.preventDefault();
    const next = items[nextIdx];
    if (next) {
      items.forEach((el) => el.setAttribute('tabindex', '-1'));
      next.setAttribute('tabindex', '0');
      next.focus();
    }
  }
};

const onFocus = () => {
  const items = getFocusableItems();
  if (items.length === 0) return;
  const hasTabStop = items.some((el) => el.getAttribute('tabindex') === '0');
  if (!hasTabStop) {
    items.forEach((el, i) => el.setAttribute('tabindex', i === 0 ? '0' : '-1'));
  }
};
</script>

<template>
  <div
    ref="toolbarRef"
    role="toolbar"
    :aria-label="$props['aria-label']"
    :aria-orientation="orientation"
    :class="cx(CLASS, orientation === 'vertical' && `${CLASS}--vertical`)"
    @keydown="onKeyDown"
    @focus="onFocus"
  >
    <slot />
  </div>
</template>
