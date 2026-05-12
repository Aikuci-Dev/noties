<template>
  <Form :of @submit="(values) => $emit('submit', values)">
    <div ref="formFieldsEl">
      <slot v-bind="{ of }" />
    </div>
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
import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";

interface FormProps<TSchema extends Schema = Schema> {
  of: FormStore<TSchema>;
}
const { of } = defineProps<FormProps<TSchema>>();
defineEmits(["submit"]);

const formFieldsEl = useTemplateRef("formFieldsEl");

const { activate, deactivate } = useFocusTrap(formFieldsEl, { allowOutsideClick: true });

defineExpose({ focusTrap: { activate, deactivate } });
</script>
