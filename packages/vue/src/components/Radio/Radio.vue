<script lang="ts">
/** Radio props type export. */
export interface RadioProps {
  /** Bound value for the group (`v-model`). Checked when equals `value`. */
  modelValue?: string | number;
  /** The value this radio represents. */
  value?: string | number;
  /** Inline label shown next to the radio. */
  label?: string;
  /** Explicit id for the input; auto-generated when omitted. */
  id?: string;
  /** Group name attribute. */
  name?: string;
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Radio — a single option in a radio group. Group radios by sharing a `name`.
 * For an accessible group, wrap them in a `<fieldset>` with a `<legend>`.
 *
 * @example
 * ```vue
 * <fieldset>
 *   <legend>Plan</legend>
 *   <Radio name="plan" value="free" label="Free" v-model="plan" />
 *   <Radio name="plan" value="pro" label="Pro" v-model="plan" />
 * </fieldset>
 * ```
 */
const props = withDefaults(defineProps<RadioProps>(), {});

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
</script>

<template>
  <span :class="cx('lily-check')">
    <input
      :id="inputId"
      type="radio"
      class="lily-check__input"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      @change="emit('update:modelValue', value!)"
    />
    <label v-if="label" class="lily-check__label" :for="inputId">{{ label }}</label>
  </span>
</template>
