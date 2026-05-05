<template>
  <span class="tw:flex tw:items-center tw:justify-center">
    <div v-if="toggleButtonPing" :class="[CLASS_BASE, CLASS_BASE_ANIMATION]" class="tw:d-btn-primary"></div>
    <div v-else :class="[CLASS_BASE, CLASS_BASE_ANIMATION]" class="tw:d-btn-secondary"></div>
    <button :class="CLASS_BASE" class="tw:relative tw:shadow-sm tw:shadow-accent/80 tw:d-btn-soft tw:d-btn-accent">
      <Icon name="lucide:user-round-plus" :size="24" />
    </button>
  </span>
</template>

<script lang="ts">
const CLASS_BASE = "tw:d-btn tw:d-btn-square";
const CLASS_BASE_ANIMATION = "tw:absolute tw:animate-ping tw:d-btn-sm";
</script>

<script setup lang="ts">
const toggleButtonPing = ref(true);
const toggleInterval = setInterval(() => {
  toggleButtonPing.value = !toggleButtonPing.value;
}, 1000);
onUnmounted(() => {
  clearInterval(toggleInterval);
});
</script>
