<script lang="ts">
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Heading — `h1`–`h6` with a token-driven scale. `level` sets semantics and the
 * default size; `display` opts into the oversized hero scale, and `as` lets you
 * decouple the rendered tag from the visual level.
 *
 * @example
 * ```vue
 * <Heading :level="1" display>ようこそ</Heading>
 * <Heading :level="3" as="h2">セクション</Heading>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Element/component to render as. */
    as?: string | object;
    /** Semantic heading level; also the default visual size. */
    level?: HeadingLevel;
    /** Oversized hero/display scale (independent of level). */
    display?: boolean;
    /** Paint the text with the signature primary gradient. */
    gradient?: boolean;
  }>(),
  { level: 2, display: false, gradient: false },
);

const tag = computed(() => props.as ?? `h${props.level}`);
const classes = computed(() =>
  cx(
    'lily-heading',
    props.display ? 'lily-heading--display' : `lily-heading--${props.level}`,
    props.gradient && 'lily-heading--gradient',
  ),
);
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
