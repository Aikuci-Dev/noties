<template>
  <Form :of @submit="(values) => $emit('submit', values)">
    <slot v-bind="{ of }" />
    <slot name="action-buttons">
      <div class="tw:flex tw:justify-end">
        <button class="tw:d-btn tw:d-btn-success">Submit</button>
      </div>
    </slot>
  </Form>
</template>

<script setup lang="ts" generic="TSchema extends Schema = Schema">
import type { FormStore, Schema } from "@formisch/vue";

import { Form } from "@formisch/vue";

interface FormProps<TSchema extends Schema = Schema> {
  of: FormStore<TSchema>;
}
const { of } = defineProps<FormProps<TSchema>>();
defineEmits(["submit"]);
</script>
