<script setup lang="ts">
import { computed, useId } from 'vue';
import { cx } from '../../utils/cx';
import { provideField, type FieldContext } from '../../composables/field';

/**
 * FormField — wires a label, help text, and error message to a form control.
 *
 * Provides ids via Vue's provide/inject so the child control gets `id`,
 * `aria-describedby`, `aria-invalid`, and `required` automatically. Works with
 * any Lily form control that calls `useFieldControl`.
 *
 * @example
 * ```vue
 * <FormField label="Email" help="We never share it." :error="err" required>
 *   <Input type="email" />
 * </FormField>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Field label text. */
    label: string;
    /** Optional help/hint text below the control. */
    help?: string;
    /** Error message; when present, the field is marked invalid. */
    error?: string;
    /** Mark the field as required (adds an indicator + `required` on control). */
    required?: boolean;
    /** Visually hide the label (still available to screen readers). */
    hideLabel?: boolean;
  }>(),
  { required: false, hideLabel: false },
);

const base = useId();
const controlId = `${base}-control`;
const helpId = computed(() => (props.help ? `${base}-help` : undefined));
const errorId = computed(() => (props.error ? `${base}-error` : undefined));
const invalid = computed(() => Boolean(props.error));

provideField(
  computed<FieldContext | null>(() => ({
    controlId,
    helpId: helpId.value,
    errorId: errorId.value,
    invalid: invalid.value,
    required: props.required,
  })),
);
</script>

<template>
  <div :class="cx('lily-field')">
    <label :class="cx('lily-label', hideLabel && 'lily-visually-hidden')" :for="controlId">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="lily-label__required" aria-hidden="true">*</span>
    </label>
    <slot />
    <div v-if="help" :id="helpId" class="lily-help">
      <slot name="help">{{ help }}</slot>
    </div>
    <div v-if="error" :id="errorId" class="lily-error">
      <slot name="error">{{ error }}</slot>
    </div>
  </div>
</template>
