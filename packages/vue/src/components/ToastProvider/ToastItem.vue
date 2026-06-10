<script lang="ts">
// no type exports needed for ToastItem
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import type { ToastEntry } from '../../composables/toast';
import CloseButton from '../CloseButton/CloseButton.vue';

/**
 * ToastItem — a single toast notification with its own auto-dismiss timer.
 * Internal to `ToastProvider`; mirrors React's `ToastItem`.
 */
const props = defineProps<{ entry: ToastEntry }>();
const emit = defineEmits<{ dismiss: [] }>();

const CLASS = 'lily-toast';
const assertive = computed(
  () => props.entry.status === 'danger' || props.entry.status === 'warning',
);

let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  if (props.entry.duration <= 0) return;
  timer = setTimeout(() => emit('dismiss'), props.entry.duration);
});

onBeforeUnmount(() => {
  if (timer !== undefined) clearTimeout(timer);
});
</script>

<template>
  <div
    :class="CLASS"
    :data-status="entry.status"
    :role="assertive ? 'alert' : 'status'"
    :aria-live="assertive ? 'assertive' : 'polite'"
  >
    <div :class="`${CLASS}__body`">{{ entry.message }}</div>
    <CloseButton label="Dismiss notification" @click="emit('dismiss')" />
  </div>
</template>
