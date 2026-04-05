<template>
  <span class="tw:flex tw:justify-center tw:items-center">
    <UButton
      v-if="toggleButtonPing"
      disabled
      icon="i-lucide-plus"
      color="primary"
      class="tw:absolute tw:animate-ping"
    />
    <UButton
      v-else
      disabled
      icon="i-lucide-plus"
      color="secondary"
      class="tw:absolute tw:animate-ping"
    />
    <UButton icon="i-lucide-plus" color="tertiary" size="lg" class="tw:relative" />
  </span>
</template>

<script setup lang="ts">
const toggleButtonPing = ref(true);
const toggleInterval = setInterval(() => {
  toggleButtonPing.value = !toggleButtonPing.value;
}, 1000);
onUnmounted(() => {
  clearInterval(toggleInterval);
});
</script>
