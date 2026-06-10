<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * Fieldset — groups related form controls with a native `<fieldset>` and
 * `<legend>` for maximum browser and screen-reader compatibility.
 *
 * Setting `disabled` disables every descendant form control in the group — this
 * is native HTML behaviour and requires no extra JS.
 *
 * @example
 * ```vue
 * <Fieldset legend="Shipping address" description="Where should we send it?">
 *   <FormField label="Street"><Input /></FormField>
 * </Fieldset>
 * ```
 */
withDefaults(
  defineProps<{
    /** Legend text — the accessible group name, rendered inside `<legend>`. */
    legend: string;
    /** Optional description displayed below the legend. */
    description?: string;
    /**
     * Disabled state propagated natively to all descendant form controls via the
     * HTML `disabled` attribute on `<fieldset>`.
     */
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const CLASS = 'lily-fieldset';
</script>

<template>
  <fieldset :disabled="disabled" :class="cx(CLASS)">
    <legend :class="`${CLASS}__legend`">
      <slot name="legend">{{ legend }}</slot>
    </legend>
    <p v-if="description" :class="`${CLASS}__description`">
      <slot name="description">{{ description }}</slot>
    </p>
    <slot />
  </fieldset>
</template>
