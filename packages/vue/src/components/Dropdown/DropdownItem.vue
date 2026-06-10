<script lang="ts">
// no type exports needed for DropdownItem
</script>

<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * DropdownItem — a single actionable menu item (`role="menuitem"`). Use inside
 * a {@link Dropdown}. Unknown attributes (incl. `@click`) fall through to the
 * inner `<button>`.
 */
defineOptions({ inheritAttrs: false });

const CLASS = 'lily-dropdown';
</script>

<template>
  <li role="none">
    <button type="button" role="menuitem" :class="cx(`${CLASS}__item`)" v-bind="$attrs">
      <slot />
    </button>
  </li>
</template>
