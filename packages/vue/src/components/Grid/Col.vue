<script lang="ts">
/** A column span: 1–12, `'auto'` (content width), or `true` (equal width). */
export type ColSpan = number | 'auto' | boolean;

/** Per-breakpoint span configuration. */
export interface ColResponsive {
  sm?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  xl?: ColSpan;
  /** Span at the `2xl` breakpoint (prop name `xxl`; emits the `-2xl` class). */
  xxl?: ColSpan;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Col — a column in the 12-column {@link Row} grid.
 *
 * @example
 * ```vue
 * <Col :span="12" :md="6" :lg="4">responsive column</Col>
 * <Col>equal width</Col>
 * <Col span="auto">content width</Col>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Element/component to render as. */
    as?: string | object;
    /** Base (xs) span. */
    span?: ColSpan;
    /** Base (xs) offset, 0–11. */
    offset?: number;
    /** Span at `sm` breakpoint. */
    sm?: ColSpan;
    /** Span at `md` breakpoint. */
    md?: ColSpan;
    /** Span at `lg` breakpoint. */
    lg?: ColSpan;
    /** Span at `xl` breakpoint. */
    xl?: ColSpan;
    /** Span at the `2xl` breakpoint (emits the `-2xl` class). */
    xxl?: ColSpan;
  }>(),
  {},
);

const CLASS = 'lily-col';

function spanClass(value: ColSpan | undefined, infix: string): string | false {
  if (value === undefined || value === false) return false;
  if (value === true) return `${CLASS}${infix}`;
  return `${CLASS}${infix}-${value}`;
}

const classes = computed(() => {
  // Default to equal-width when no base span is given.
  const base = props.span === undefined && props.offset === undefined ? true : props.span;

  return cx(
    spanClass(base, ''),
    props.offset ? `lily-offset-${props.offset}` : false,
    spanClass(props.sm, '-sm'),
    spanClass(props.md, '-md'),
    spanClass(props.lg, '-lg'),
    spanClass(props.xl, '-xl'),
    spanClass(props.xxl, '-2xl'),
  );
});
</script>

<template>
  <component :is="as ?? 'div'" :class="classes">
    <slot />
  </component>
</template>
