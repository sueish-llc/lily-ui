<script lang="ts">
export interface CascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Cascader — hierarchical selection shown as side-by-side columns. Bind the
 * selected path with `v-model`.
 *
 * @example
 * ```vue
 * <Cascader v-model="path" :options="regions" label="地域" />
 * ```
 */
const props = defineProps<{ options: CascaderOption[]; label?: string }>();
const model = defineModel<string[]>({ default: () => [] });

const columns = computed(() => {
  const cols: CascaderOption[][] = [props.options];
  let level = props.options;
  for (const id of model.value) {
    const opt = level.find((o) => o.value === id);
    if (opt?.children?.length) {
      cols.push(opt.children);
      level = opt.children;
    } else break;
  }
  return cols;
});

function pick(depth: number, opt: CascaderOption): void {
  model.value = [...model.value.slice(0, depth), opt.value];
}
</script>

<template>
  <div :class="cx('lily-cascader')" role="group" :aria-label="label ?? 'Cascader'">
    <div v-for="(col, depth) in columns" :key="depth" class="lily-cascader__column">
      <button
        v-for="opt in col"
        :key="opt.value"
        type="button"
        :class="cx('lily-cascader__option', model[depth] === opt.value && 'lily-cascader__option--active')"
        :aria-disabled="opt.disabled || undefined"
        :disabled="opt.disabled"
        @click="pick(depth, opt)"
      >
        <span>{{ opt.label }}</span>
        <span v-if="opt.children && opt.children.length" class="lily-cascader__arrow" aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>
