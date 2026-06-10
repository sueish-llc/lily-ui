<script lang="ts">
/** FloatingLabel props type export. */
export interface FloatingLabelProps {
  /** The floating label text. */
  label: string;
  /** Explicit id to link the label; auto-generated when omitted. */
  id?: string;
}
</script>

<script setup lang="ts">
import { computed, useId, onMounted, ref } from 'vue';
import { cx } from '../../utils/cx';

/**
 * FloatingLabel — a label that floats above the control when it has focus or a
 * value. Wrap a single Input/Select/Textarea in the default slot.
 *
 * The label is a real `<label for>`, so it remains fully accessible.
 * The slotted control receives `id` and `placeholder=" "` automatically
 * (the placeholder is required for the CSS `:not(:placeholder-shown)` trigger).
 *
 * @example
 * ```vue
 * <FloatingLabel label="Email"><Input type="email" /></FloatingLabel>
 * ```
 */
const props = withDefaults(defineProps<FloatingLabelProps>(), {});

const autoId = useId();
const controlId = computed(() => props.id ?? autoId);

const containerRef = ref<HTMLElement | null>(null);

/** Wire the slotted control with id and placeholder after mount. */
onMounted(() => {
  if (!containerRef.value) return;
  const control = containerRef.value.querySelector<HTMLElement>('input, select, textarea');
  if (!control) return;
  if (!control.getAttribute('id')) control.setAttribute('id', controlId.value);
  if (control.tagName !== 'SELECT' && !control.getAttribute('placeholder')) {
    control.setAttribute('placeholder', ' ');
  }
});
</script>

<template>
  <div ref="containerRef" :class="cx('lily-floating')">
    <slot />
    <label :for="controlId">{{ label }}</label>
  </div>
</template>
