<script lang="ts">
/** Checkbox props type export. */
export interface CheckboxProps {
  /** Bound checked state (`v-model`). */
  modelValue?: boolean;
  /** Inline label shown next to the checkbox. */
  label?: string;
  /** Explicit id for the input; auto-generated when omitted. */
  id?: string;
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Checkbox — a single boolean control with an inline label. Supports `v-model`.
 *
 * @example
 * ```vue
 * <Checkbox label="Accept terms" v-model="ok" />
 * ```
 */
const props = withDefaults(defineProps<CheckboxProps>(), {});

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
</script>

<template>
  <span :class="cx('lily-check')">
    <input
      :id="inputId"
      type="checkbox"
      class="lily-check__input"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label v-if="label" class="lily-check__label" :for="inputId">{{ label }}</label>
  </span>
</template>
