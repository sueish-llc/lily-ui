<script setup lang="ts">
import { computed, ref } from 'vue';
import { cx } from '../../utils/cx';

/**
 * PinInput — a row of single-character fields for codes / OTP, with
 * auto-advance, backspace-to-previous, arrow navigation, and paste. Bind the
 * concatenated value with `v-model`; `@complete` fires when all cells fill.
 *
 * @example
 * ```vue
 * <PinInput v-model="code" :length="6" label="認証コード" @complete="verify" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    length?: number;
    type?: 'numeric' | 'text';
    mask?: boolean;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    label?: string;
  }>(),
  { length: 6, type: 'numeric', mask: false, size: 'md', disabled: false, label: 'Digit' },
);

const model = defineModel<string>({ default: '' });
const emit = defineEmits<{ complete: [value: string] }>();

const fields = ref<HTMLInputElement[]>([]);
function setField(i: number, el: unknown): void {
  if (el) fields.value[i] = el as HTMLInputElement;
}

const chars = computed(() => Array.from({ length: props.length }, (_, i) => model.value[i] ?? ''));
const classes = computed(() => cx('lily-pin-input', props.size !== 'md' && `lily-pin-input--${props.size}`));

function isAllowed(ch: string): boolean {
  return props.type === 'numeric' ? /^[0-9]$/.test(ch) : ch.length === 1;
}
function focusCell(i: number): void {
  const el = fields.value[Math.max(0, Math.min(props.length - 1, i))];
  el?.focus();
  el?.select();
}
function commit(next: string): void {
  model.value = next;
  if (next.length === props.length && !next.includes(' ')) emit('complete', next);
}
function setCharAt(i: number, ch: string): string {
  const arr = Array.from({ length: props.length }, (_, k) => model.value[k] ?? ' ');
  arr[i] = ch || ' ';
  return arr.join('').replace(/ +$/, '');
}
function onInput(i: number, e: Event): void {
  const target = e.target as HTMLInputElement;
  const ch = target.value.slice(-1);
  if (ch && !isAllowed(ch)) {
    target.value = chars.value[i] ?? '';
    return;
  }
  commit(setCharAt(i, ch));
  if (ch && i < props.length - 1) focusCell(i + 1);
}
function onKeydown(i: number, e: KeyboardEvent): void {
  if (e.key === 'Backspace' && !chars.value[i] && i > 0) {
    e.preventDefault();
    commit(setCharAt(i - 1, ''));
    focusCell(i - 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    focusCell(i - 1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    focusCell(i + 1);
  }
}
function onPaste(i: number, e: ClipboardEvent): void {
  e.preventDefault();
  const pasted = (e.clipboardData?.getData('text') ?? '').split('').filter(isAllowed);
  if (pasted.length === 0) return;
  const arr = Array.from({ length: props.length }, (_, k) => model.value[k] ?? ' ');
  for (let k = 0; k < pasted.length && i + k < props.length; k++) arr[i + k] = pasted[k]!;
  commit(arr.join('').replace(/ +$/, ''));
  focusCell(Math.min(props.length - 1, i + pasted.length));
}
</script>

<template>
  <div :class="classes">
    <input
      v-for="(ch, i) in chars"
      :key="i"
      :ref="(el) => setField(i, el)"
      class="lily-pin-input__field"
      :type="mask ? 'password' : 'text'"
      :inputmode="type === 'numeric' ? 'numeric' : 'text'"
      :autocomplete="i === 0 ? 'one-time-code' : 'off'"
      maxlength="1"
      :disabled="disabled"
      :value="ch"
      :aria-label="`${label} ${i + 1}`"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @paste="onPaste(i, $event)"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>
