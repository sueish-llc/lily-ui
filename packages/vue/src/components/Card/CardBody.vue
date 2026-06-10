<script setup lang="ts">
/** Card body region. */
defineProps<{ as?: string | object }>();
</script>

<template>
  <component :is="as ?? 'div'" class="lily-card__body">
    <slot />
  </component>
</template>
