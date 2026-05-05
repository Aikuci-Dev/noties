<template>
  <span v-if="Boolean(errors)" :id="`${name}-error`" class="tw:d-validator-hint">
    <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
  </span>
</template>

<script setup lang="ts">
// Source: https://github.com/open-circle/formisch/blob/main/playgrounds/vue/src/components/InputErrors.vue
interface InputErrorProps {
  name: string;
  errors?: [string, ...string[]] | null;
}

const { name, errors } = defineProps<InputErrorProps>();

// Use frozen error signal
const frozenErrors = shallowRef<[string, ...string[]] | null>(null);

// Freeze error while element collapses to prevent UI from jumping
watch(
  () => errors,
  (nextErrors) => {
    if (nextErrors) frozenErrors.value = nextErrors;
    else {
      const timeout = setTimeout(() => {
        frozenErrors.value = null;
      }, 200);
      onWatcherCleanup(() => clearTimeout(timeout));
    }
  },
);
</script>
