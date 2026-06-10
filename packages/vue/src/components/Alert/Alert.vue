<script lang="ts">
export type AlertStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info';
</script>

<script setup lang="ts">
import { cx } from '../../utils/cx';
import CloseButton from '../CloseButton/CloseButton.vue';

/**
 * Alert — a contextual feedback message.
 *
 * Provide the message via the default slot. Use the `title` prop (or `#title`
 * slot) for a bold heading and the `#icon` slot for a leading icon. Set
 * `dismissible` to show a close button, which emits `close`.
 *
 * @example
 * ```vue
 * <Alert status="success" title="Saved">Your changes are stored.</Alert>
 * <Alert status="danger" role="alert" dismissible @close="dismiss">Failed.</Alert>
 * ```
 */
withDefaults(
  defineProps<{
    /** Semantic color/intent. */
    status?: AlertStatus;
    /** Optional bold title shown above the body. */
    title?: string;
    /** Show a dismiss button (emits `close`). */
    dismissible?: boolean;
    /** Accessible label for the dismiss button. */
    closeLabel?: string;
    /**
     * ARIA live semantics. Use `'alert'` (assertive) for errors that need
     * immediate attention, `'status'` (polite) for non-critical messages.
     */
    role?: 'alert' | 'status';
  }>(),
  { status: 'primary', dismissible: false, closeLabel: 'Close', role: 'status' },
);

defineEmits<{ close: [] }>();
</script>

<template>
  <div :role="role" :data-status="status" :class="cx('lily-alert')">
    <span v-if="$slots.icon" class="lily-alert__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <div class="lily-alert__body">
      <div v-if="$slots.title || title" class="lily-alert__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <slot />
    </div>
    <CloseButton v-if="dismissible" :label="closeLabel" @click="$emit('close')" />
  </div>
</template>
