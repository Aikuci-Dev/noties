<template>
  <div class="tw:d-fab" :class="{ 'tw:relative!': isRelative }">
    <slot />
  </div>
</template>

<script setup lang="ts">
const { isRelative } = defineProps<{ isRelative?: boolean }>();
</script>
