<script lang="ts">
// no type exports needed for DropdownDivider
</script>

<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * DropdownDivider — a visual separator between menu items. Use inside a
 * {@link Dropdown}.
 */
const CLASS = 'lily-dropdown';
</script>

<template>
  <li role="none">
    <hr :class="cx(`${CLASS}__divider`)" />
  </li>
</template>
