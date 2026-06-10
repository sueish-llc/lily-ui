<script lang="ts">
export type TextVariant = 'body' | 'lead' | 'small' | 'label' | 'caption' | 'overline';
export type TextTone =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'primary'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Text — body/label/caption typography with semantic tone. Renders a `<p>` by
 * default; change the element with `as`.
 *
 * @example
 * ```vue
 * <Text variant="lead">導入の一文。</Text>
 * <Text as="span" variant="caption" tone="muted">補足</Text>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Element/component to render as. */
    as?: string | object;
    /** Role preset. */
    variant?: TextVariant;
    /** Color role. */
    tone?: TextTone;
    /** Truncate to a single line with an ellipsis. */
    truncate?: boolean;
  }>(),
  { variant: 'body', tone: 'default', truncate: false },
);

const classes = computed(() =>
  cx(
    'lily-text',
    props.variant !== 'body' && `lily-text--${props.variant}`,
    props.truncate && 'lily-text--truncate',
  ),
);
</script>

<template>
  <component :is="as ?? 'p'" :class="classes" :data-tone="tone !== 'default' ? tone : undefined">
    <slot />
  </component>
</template>
