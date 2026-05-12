<template>
  <div class="tw:flex tw:flex-col">
    <label v-if="label" :for="name" class="tw:d-label tw:text-base">
      {{ label }} <span v-if="required" class="tw:required-asterisk">*</span>
    </label>

    <slot></slot>

    <p v-if="description" class="tw:text-muted">{{ description }}</p>

    <UiFormFieldErrors :name :errors />
  </div>
</template>

<script setup lang="ts">
export interface WrapperVariantProps {
  label?: string;
  description?: string;
  required?: boolean;
  name: string;
  errors?: [string, ...string[]] | null;
}

const { label, description, required = true, name, errors } = defineProps<WrapperVariantProps>();
</script>
