<script lang="ts">
// no type exports needed for ContextMenuDivider
</script>

<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * ContextMenuDivider — a visual separator between menu items. Use inside a
 * {@link ContextMenu}.
 */
const CLASS = 'lily-context-menu';
</script>

<template>
  <div :class="cx(`${CLASS}__divider`)" role="separator" />
</template>
