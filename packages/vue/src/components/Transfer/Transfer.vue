<script lang="ts">
export interface TransferItem {
  value: string;
  label: string;
  disabled?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { cx } from '../../utils/cx';
import Button from '../Button/Button.vue';

/**
 * Transfer — move items between a source and a target list. Bind the target
 * values with `v-model`.
 *
 * @example
 * ```vue
 * <Transfer v-model="selected" :items="all" :titles="['候補', '選択済み']" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    items: TransferItem[];
    titles?: [string, string];
    toTargetLabel?: string;
    toSourceLabel?: string;
  }>(),
  { titles: () => ['Available', 'Selected'], toTargetLabel: 'Add selected', toSourceLabel: 'Remove selected' },
);

const model = defineModel<string[]>({ default: () => [] });
const checked = ref<Set<string>>(new Set());
const targetSet = computed(() => new Set(model.value));
const sourceItems = computed(() => props.items.filter((it) => !targetSet.value.has(it.value)));
const targetItems = computed(() => props.items.filter((it) => targetSet.value.has(it.value)));
const hasSourceChecked = computed(() => sourceItems.value.some((it) => checked.value.has(it.value)));
const hasTargetChecked = computed(() => targetItems.value.some((it) => checked.value.has(it.value)));

function toggle(v: string): void {
  const next = new Set(checked.value);
  if (next.has(v)) next.delete(v);
  else next.add(v);
  checked.value = next;
}
function moveToTarget(): void {
  const moving = sourceItems.value.filter((it) => checked.value.has(it.value) && !it.disabled).map((it) => it.value);
  model.value = [...model.value, ...moving];
  checked.value = new Set([...checked.value].filter((v) => !moving.includes(v)));
}
function moveToSource(): void {
  const moving = targetItems.value.filter((it) => checked.value.has(it.value) && !it.disabled).map((it) => it.value);
  model.value = model.value.filter((v) => !moving.includes(v));
  checked.value = new Set([...checked.value].filter((v) => !moving.includes(v)));
}
</script>

<template>
  <div :class="cx('lily-transfer')">
    <div class="lily-transfer__list">
      <div class="lily-transfer__header">{{ titles[0] }}</div>
      <ul class="lily-transfer__items">
        <li v-for="it in sourceItems" :key="it.value">
          <label class="lily-transfer__item">
            <input type="checkbox" :checked="checked.has(it.value)" :disabled="it.disabled" @change="toggle(it.value)" />
            <span>{{ it.label }}</span>
          </label>
        </li>
      </ul>
    </div>
    <div class="lily-transfer__actions">
      <Button size="sm" variant="outline" :aria-label="toTargetLabel" :disabled="!hasSourceChecked" @click="moveToTarget">
        <span aria-hidden="true">›</span>
      </Button>
      <Button size="sm" variant="outline" :aria-label="toSourceLabel" :disabled="!hasTargetChecked" @click="moveToSource">
        <span aria-hidden="true">‹</span>
      </Button>
    </div>
    <div class="lily-transfer__list">
      <div class="lily-transfer__header">{{ titles[1] }}</div>
      <ul class="lily-transfer__items">
        <li v-for="it in targetItems" :key="it.value">
          <label class="lily-transfer__item">
            <input type="checkbox" :checked="checked.has(it.value)" :disabled="it.disabled" @change="toggle(it.value)" />
            <span>{{ it.label }}</span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>
