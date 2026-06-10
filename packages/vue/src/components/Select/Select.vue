<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../../composables/field';

/**
 * Select — a native dropdown control (accessible by default). Supports `v-model`.
 *
 * Inside a {@link FormField} it inherits `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically.
 *
 * @example
 * ```vue
 * <FormField label="Country">
 *   <Select v-model="country">
 *     <option value="jp">Japan</option>
 *     <option value="us">USA</option>
 *   </Select>
 * </FormField>
 * ```
 */
defineProps<{
  /** Bound value (`v-model`). */
  modelValue?: string | number;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const fieldAttrs = useFieldControl(() => ({}));

const classes = computed(() => cx('lily-select'));
</script>

<template>
  <select
    :class="classes"
    v-bind="fieldAttrs"
    :value="modelValue"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>
