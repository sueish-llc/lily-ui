<script setup lang="ts">
import { computed, useId, watch } from 'vue';
import {
  buildThemeOverrideCss,
  warnContrastIssues,
  type ThemeColorOverrides,
} from '../../utils/themeOverride';

/**
 * ThemeOverride — re-colors a subtree with personal color preferences by
 * overriding the semantic `--lily-color-*` tokens, while the accessible
 * defaults keep applying everywhere else.
 *
 * Overrides are partial (only the tokens you name change), per scheme if you
 * want (`light` / `dark` apply only while that scheme is active, following the
 * same `data-theme` + `prefers-color-scheme` logic as the base stylesheet).
 * The wrapper is `display: contents`, so layout is unaffected, and instances
 * nest (the closest one wins). The overrides never reach outside this subtree —
 * to re-color the whole app, pass the same `colors` / `light` / `dark` to
 * `ThemeProvider` instead.
 *
 * In development, text/background pairs overridden together are checked
 * against the WCAG 2.1 AAA contrast floor (7:1) and failures are logged. To
 * validate an end user's picks at runtime, use `findContrastIssues`.
 *
 * @example
 * ```vue
 * <ThemeOverride
 *   :colors="{ primary: '#115e59', 'primary-hover': '#134e4a', 'on-primary': '#ffffff' }"
 *   :dark="{ 'bg-canvas': '#101418' }"
 * >
 *   <Button status="primary">保存する</Button>
 * </ThemeOverride>
 * ```
 */
const props = defineProps<{
  /** Token overrides applied in both color schemes. */
  colors?: ThemeColorOverrides;
  /** Token overrides applied only while the light scheme is active. */
  light?: ThemeColorOverrides;
  /** Token overrides applied only while the dark scheme is active. */
  dark?: ThemeColorOverrides;
}>();

const id = useId();
const css = computed(() =>
  buildThemeOverrideCss(id, { colors: props.colors, light: props.light, dark: props.dark }),
);

// Dev-only AAA guard, keyed on the generated CSS so it re-runs only when the
// effective overrides change.
watch(
  css,
  () => warnContrastIssues({ colors: props.colors, light: props.light, dark: props.dark }, 'ThemeOverride'),
  { immediate: true },
);
</script>

<template>
  <div class="lily-theme-override" :data-lily-theme-override="id">
    <component :is="'style'" v-if="css">{{ css }}</component>
    <slot />
  </div>
</template>
