<script lang="ts">
/** Visual emphasis of the button. */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
/** Semantic intent, mapped to theme color tokens. */
export type ButtonStatus = 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
/** Control size. */
export type ButtonSize = 'sm' | 'md' | 'lg';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Button — the primary action control.
 *
 * Styling comes from `@lily-ui/css` (import `@lily-ui/css/styles` once in your
 * app). This component renders the correct markup, class names, and ARIA state.
 *
 * - Renders a native `<button>` by default; pass `as="a"` (with `href`) for a link.
 * - `loading` sets `aria-busy` and exposes an accessible loading label.
 * - Use the `#start` / `#end` slots for leading / trailing icons.
 *
 * @example
 * ```vue
 * <Button status="danger" variant="outline" @click="remove">Delete</Button>
 * <Button as="a" href="/docs">Read the docs</Button>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Element/component to render as. */
    as?: string | object;
    /** Visual style. */
    variant?: ButtonVariant;
    /** Semantic intent / color. */
    status?: ButtonStatus;
    /** Size. */
    size?: ButtonSize;
    /** Stretch to fill the container width. */
    block?: boolean;
    /** Show a spinner and disable interaction. */
    loading?: boolean;
    /** Accessible label announced while `loading` is true. */
    loadingLabel?: string;
    /** Disable the button. */
    disabled?: boolean;
    /** Native button type (when rendered as a `<button>`). */
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'solid',
    status: 'primary',
    size: 'md',
    block: false,
    loading: false,
    loadingLabel: 'Loading',
  },
);

const tag = computed(() => props.as ?? 'button');
const isNativeButton = computed(() => tag.value === 'button');
const isDisabled = computed(() => props.disabled || props.loading);

const classes = computed(() =>
  cx(
    'lily-button',
    `lily-button--${props.variant}`,
    `lily-button--${props.size}`,
    props.block && 'lily-button--block',
  ),
);

const nativeProps = computed(() =>
  isNativeButton.value
    ? { type: props.type ?? 'button', disabled: isDisabled.value }
    : { 'aria-disabled': isDisabled.value || undefined },
);
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :data-status="status"
    :aria-busy="loading || undefined"
    v-bind="nativeProps"
  >
    <span v-if="loading" class="lily-button__spinner" aria-hidden="true" />
    <span v-if="!loading && $slots.start" aria-hidden="true"><slot name="start" /></span>
    <slot />
    <span v-if="!loading && $slots.end" aria-hidden="true"><slot name="end" /></span>
    <span v-if="loading" class="lily-visually-hidden">{{ loadingLabel }}</span>
  </component>
</template>
