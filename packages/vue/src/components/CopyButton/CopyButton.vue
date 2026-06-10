<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { cx } from '../../utils/cx';

/**
 * CopyButton — copies `value` to the clipboard and confirms with a check icon.
 *
 * @example
 * ```vue
 * <CopyButton value="--lily-color-primary-100" />
 * <CopyButton :value="code" label="Copy" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Text written to the clipboard on click. */
    value: string;
    /** Visible label beside the icon. Omit for an icon-only button. */
    label?: string;
    /** Accessible name (esp. icon-only). */
    copyLabel?: string;
    /** Announced + shown briefly after a copy. */
    copiedLabel?: string;
    /** Control size. */
    size?: 'sm' | 'md';
  }>(),
  { copyLabel: 'Copy', copiedLabel: 'Copied', size: 'md' },
);

const emit = defineEmits<{ copy: [value: string] }>();
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
onBeforeUnmount(() => clearTimeout(timer));

const onClick = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
    copied.value = true;
    emit('copy', props.value);
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1600);
  } catch {
    /* clipboard unavailable */
  }
};
</script>

<template>
  <button
    type="button"
    :class="cx('lily-copy-button', `lily-copy-button--${size}`, copied && 'lily-copy-button--copied')"
    :aria-label="label == null ? (copied ? copiedLabel : copyLabel) : undefined"
    @click="onClick"
  >
    <svg
      v-if="!copied"
      class="lily-copy-button__icon"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.8" />
      <path d="M5 15V5a2 2 0 0 1 2-2h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </svg>
    <svg
      v-else
      class="lily-copy-button__icon"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span v-if="label != null" class="lily-copy-button__label">{{ copied ? copiedLabel : label }}</span>
    <span class="lily-visually-hidden" role="status" aria-live="polite">{{ copied ? copiedLabel : '' }}</span>
  </button>
</template>
