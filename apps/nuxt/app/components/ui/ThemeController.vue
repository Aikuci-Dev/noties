<template>
  <label class="tw:d-swap tw:d-swap-rotate">
    <!-- Issue URL: https://github.com/saadeghi/daisyui/issues/4513 -->
    <!-- Broken when using prefix, not as documented (d-theme-controller) -->
    <!-- See: https://daisyui.com/components/theme-controller -->
    <input
      :value="isPreferredDark ? 'light' : 'dark'"
      :checked="isPreferredDark ? !isDark : isDark"
      @change="toggleDark()"
      type="checkbox"
      class="theme-controller"
    />
    <Icon name="lucide:sun" :class="isPreferredDark ? 'tw:d-swap-off' : 'tw:d-swap-on'" />
    <Icon name="lucide:moon" :class="isPreferredDark ? 'tw:d-swap-on' : 'tw:d-swap-off'" />
  </label>
</template>

<script setup lang="ts">
const isPreferredDark = usePreferredDark();
const isDark = useDark();
const toggleDark = useToggle(isDark, { falsyValue: "light", truthyValue: "dark" });
</script>
