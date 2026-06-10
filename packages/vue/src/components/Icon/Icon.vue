<script lang="ts">
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';
export type IconTone = 'default' | 'primary' | 'accent' | 'muted' | 'danger' | 'success' | 'warning' | 'info';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Icon — a sizing/color wrapper around any inline SVG or glyph (default slot).
 * Decorative by default; pass `label` to make it meaningful (`role="img"`).
 *
 * @example
 * ```vue
 * <Icon size="lg" tone="primary" label="検索"><SearchSvg /></Icon>
 * <Icon><ChevronSvg /></Icon>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Size token (sets `font-size`; the icon is `1em` square). */
    size?: IconSize;
    /** Semantic color (uses the AAA `*-text` tokens). */
    tone?: IconTone;
    /** Accessible label; when set, the icon is meaningful rather than decorative. */
    label?: string;
  }>(),
  { size: 'md', tone: 'default' },
);

const classes = computed(() => cx('lily-icon', props.size !== 'md' && `lily-icon--${props.size}`));
</script>

<template>
  <span
    :class="classes"
    :data-tone="tone !== 'default' ? tone : undefined"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
  >
    <slot />
  </span>
</template>
