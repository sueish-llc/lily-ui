<script lang="ts">
// Re-export the toast types so they are reachable from the package entry.
export type {
  ToastStatus,
  ToastPlacement,
  ToastOptions,
} from '../../composables/toast';
</script>

<script setup lang="ts">
import { cx } from '../../utils/cx';
import { provideToast, type ToastPlacement } from '../../composables/toast';
import ToastItem from './ToastItem.vue';

/**
 * ToastProvider — provides the toast store and renders a live region.
 *
 * Toasts are announced via an `aria-live` region (`polite`, or `assertive` for
 * danger/warning). Wrap your app once, then call `useToast()` from descendants.
 *
 * @example
 * ```vue
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * <!-- elsewhere: const { toast } = useToast(); toast({ message: 'Saved' }); -->
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Where toasts appear. */
    placement?: ToastPlacement;
  }>(),
  { placement: 'bottom-end' },
);

const REGION = 'lily-toast-region';
const { toasts, dismiss } = provideToast();
</script>

<template>
  <slot />
  <Teleport to="body">
    <div :class="cx(REGION, `${REGION}--${props.placement}`)" role="region" aria-label="Notifications">
      <ToastItem
        v-for="t in toasts"
        :key="t.id"
        :entry="t"
        @dismiss="dismiss(t.id)"
      />
    </div>
  </Teleport>
</template>
