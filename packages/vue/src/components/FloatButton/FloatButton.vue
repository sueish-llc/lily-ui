<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

export type FloatButtonPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type FloatButtonShape = 'circle' | 'square';
export type FloatButtonStatus = 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
export type FloatButtonSize = 'sm' | 'md' | 'lg';

/**
 * FloatButton — a floating action button anchored to a viewport corner.
 * Always provide an accessible name: pass `aria-label` when icon-only.
 *
 * @example
 * ```vue
 * <FloatButton position="bottom-right" aria-label="ページ先頭へ戻る">↑</FloatButton>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Corner of the viewport to anchor to. */
    position?: FloatButtonPosition;
    /** Semantic color. */
    status?: FloatButtonStatus;
    /** Control size. */
    size?: FloatButtonSize;
    /** Button shape. */
    shape?: FloatButtonShape;
  }>(),
  {
    position: 'bottom-right',
    status: 'primary',
    size: 'md',
    shape: 'circle',
  },
);

const classes = computed(() =>
  cx(
    'lily-float-button',
    `lily-float-button--${props.position}`,
    `lily-float-button--${props.size}`,
    `lily-float-button--${props.shape}`,
  ),
);
</script>

<template>
  <button
    type="button"
    :class="classes"
    :data-status="status"
  >
    <slot />
  </button>
</template>
