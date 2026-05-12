<template>
  <DefineTemplate>
    <input
      v-model="model"
      v-bind="field.props"
      :id="field.props.name"
      :placeholder
      :required
      class="tw:d-validator tw:d-input tw:w-full"
      :aria-invalid="Boolean(field.errors)"
      :aria-errormessage="`${field.props.name}-error`"
    />
  </DefineTemplate>

  <UiFormWrapperVariant v-if="wrapper" :field v-bind="wrapperProps">
    <ReuseTemplate />
  </UiFormWrapperVariant>
  <ReuseTemplate v-else />
</template>

<script lang="ts">
import type { FieldStore, RequiredPath, Schema } from "@formisch/vue";

import type { WrapperVariantProps } from "./WrapperVariant.vue";

export interface InputProps {
  placeholder?: string;
  required?: boolean;
}
</script>

<script setup lang="ts" generic="TSchema extends Schema, TFieldPath extends RequiredPath">
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const {
  wrapperProps: wrapper,
  field,
  placeholder,
  required = true,
} = defineProps<InputProps & { wrapperProps?: WrapperVariantProps; field: FieldStore<TSchema, TFieldPath> }>();
const model = defineModel({ required: true });

const wrapperProps = computed(() => ({ ...wrapper, required, name: field.props.name, errors: field.errors }));
</script>
