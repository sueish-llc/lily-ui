<script lang="ts">
/** Switch props type export. */
export interface SwitchProps {
  /** Bound checked state (`v-model`). */
  modelValue?: boolean;
  /** Inline label shown next to the switch. */
  label?: string;
  /** Explicit id for the input; auto-generated when omitted. */
  id?: string;
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Switch — a toggle styled as a sliding switch. It is a checkbox under the
 * hood with `role="switch"`, so it's fully keyboard accessible.
 *
 * @example
 * ```vue
 * <Switch label="Enable notifications" v-model="on" />
 * ```
 */
const props = withDefaults(defineProps<SwitchProps>(), {});

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
</script>

<template>
  <span :class="cx('lily-switch')">
    <input
      :id="inputId"
      type="checkbox"
      role="switch"
      class="lily-switch__input"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label v-if="label" class="lily-switch__label" :for="inputId">{{ label }}</label>
  </span>
</template>
