<script setup lang="ts">
import { computed, watch } from 'vue';
import { provideTheme, type ThemeMode } from '../../composables/theme';
import {
  buildThemeOverrideCss,
  warnContrastIssues,
  type ThemeColorOverrides,
} from '../../utils/themeOverride';

/**
 * ThemeProvider — establishes the Lily theme context for descendants, keeps
 * `<html data-theme>` in sync with the selected mode, and (optionally) applies
 * app-wide color-token overrides.
 *
 * Theme-wide concerns live here: mode selection/persistence and the
 * `colors` / `light` / `dark` token overrides, which target `:root` so they
 * also reach `body` backgrounds and overlays teleported to `body`. To re-color
 * only a subtree, use `ThemeOverride` instead — it never affects anything
 * outside its children.
 *
 * **Accessibility caution:** the default palette is verified against WCAG 2.1
 * AAA (7:1 text contrast); colors you pick yourself carry no such guarantee.
 * Overridden text/background pairs are checked in development, and end-user
 * picks should be validated with `findContrastIssues` before applying.
 *
 * @example
 * ```vue
 * <ThemeProvider default-mode="system" :colors="{ primary: '#115e59', 'on-primary': '#ffffff' }">
 *   <App />
 * </ThemeProvider>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Initial mode before any stored preference is read. */
    defaultMode?: ThemeMode;
    /** Persist the user's choice to localStorage. */
    enablePersistence?: boolean;
    /** localStorage key. */
    storageKey?: string;
    /** App-wide color-token overrides applied in both schemes. */
    colors?: ThemeColorOverrides;
    /** App-wide color-token overrides applied only in the light scheme. */
    light?: ThemeColorOverrides;
    /** App-wide color-token overrides applied only in the dark scheme. */
    dark?: ThemeColorOverrides;
  }>(),
  {
    defaultMode: 'system',
    enablePersistence: true,
    storageKey: 'lily-theme',
    colors: undefined,
    light: undefined,
    dark: undefined,
  },
);

provideTheme({
  defaultMode: props.defaultMode,
  enablePersistence: props.enablePersistence,
  storageKey: props.storageKey,
});

// App-wide token overrides, emitted as scheme-strength `:root` rules so they
// follow the active scheme purely in CSS (and win over the base stylesheet).
const css = computed(() =>
  buildThemeOverrideCss('', {
    colors: props.colors,
    light: props.light,
    dark: props.dark,
    global: true,
  }),
);

// Dev-only AAA guard, keyed on the generated CSS so it re-runs only when the
// effective overrides change.
watch(
  css,
  () => warnContrastIssues({ colors: props.colors, light: props.light, dark: props.dark }, 'ThemeProvider'),
  { immediate: true },
);
</script>

<template>
  <component :is="'style'" v-if="css">{{ css }}</component>
  <slot />
</template>
