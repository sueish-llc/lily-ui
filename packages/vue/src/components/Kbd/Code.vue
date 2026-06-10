<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Code — inline (or block) monospace code.
 *
 * @example
 * ```vue
 * <Code>npm i @lily-ui/vue</Code>
 * <Code block>{{ source }}</Code>
 * ```
 */
const props = withDefaults(defineProps<{ block?: boolean }>(), { block: false });
const classes = computed(() => cx('lily-code', props.block && 'lily-code--block'));
</script>

<template>
  <code :class="classes"><slot /></code>
</template>
