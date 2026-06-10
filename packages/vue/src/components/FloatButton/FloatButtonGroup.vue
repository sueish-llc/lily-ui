<script setup lang="ts">
import { ref, computed } from 'vue';
import { cx } from '../../utils/cx';

export type FloatButtonPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

/**
 * FloatButtonGroup — a speed-dial that stacks several `FloatButton`s.
 * The main trigger button toggles the child buttons. Press Escape to close.
 * Keyboard-operable and screen-reader-friendly.
 *
 * @example
 * ```vue
 * <FloatButtonGroup position="bottom-right" trigger-label="アクションを開く">
 *   <template #trigger>+</template>
 *   <FloatButton aria-label="メモを追加">📝</FloatButton>
 * </FloatButtonGroup>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Corner of the viewport to anchor to. */
    position?: FloatButtonPosition;
    /** Accessible label for the main trigger button. */
    triggerLabel?: string;
  }>(),
  {
    position: 'bottom-right',
    triggerLabel: 'Toggle actions',
  },
);

const open = ref(false);
const toggle = () => { open.value = !open.value; };
const close = () => { open.value = false; };

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
};

const handleBlur = (e: FocusEvent) => {
  const groupEl = (e.currentTarget as HTMLElement);
  if (!groupEl.contains(e.relatedTarget as Node)) close();
};

const classes = computed(() =>
  cx(
    'lily-float-button-group',
    `lily-float-button-group--${props.position}`,
    open.value && 'lily-float-button-group--open',
  ),
);
</script>

<template>
  <div
    :class="classes"
    @keydown="handleKeyDown"
    @blur.capture="handleBlur"
  >
    <!-- Child action buttons -->
    <div
      class="lily-float-button-group__items"
      :aria-hidden="!open"
      role="group"
    >
      <slot />
    </div>

    <!-- Main trigger button -->
    <button
      type="button"
      class="lily-float-button lily-float-button--circle lily-float-button-group__trigger"
      :aria-expanded="open"
      aria-haspopup="true"
      :aria-label="triggerLabel"
      @click="toggle"
    >
      <slot name="trigger">+</slot>
    </button>
  </div>
</template>
