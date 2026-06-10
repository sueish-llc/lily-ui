<script setup lang="ts">
import { provideMotion, type MotionPreference } from '../../composables/motion';

/**
 * MotionProvider — establishes the Lily motion tier for descendants and keeps
 * `<html data-motion>` in sync, so the CSS layer trades silky motion for the
 * bare minimum on low-end devices. Independent of `prefers-reduced-motion`.
 *
 * @example
 * ```vue
 * <MotionProvider default-preference="auto">
 *   <App />
 * </MotionProvider>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Initial preference before any stored value is read. */
    defaultPreference?: MotionPreference;
    /** Persist the user's choice to localStorage. */
    enablePersistence?: boolean;
    /** localStorage key. */
    storageKey?: string;
  }>(),
  {
    defaultPreference: 'auto',
    enablePersistence: true,
    storageKey: 'lily-motion',
  },
);

provideMotion({
  defaultPreference: props.defaultPreference,
  enablePersistence: props.enablePersistence,
  storageKey: props.storageKey,
});
</script>

<template>
  <slot />
</template>
