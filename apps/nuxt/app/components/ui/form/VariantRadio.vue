<template>
  <DefineTemplate>
    <input
      v-bind="field.props"
      :id="`${field.props.name}-${value}`"
      :value
      :checked
      @input="handleInput"
      :aria-invalid="Boolean(field.errors)"
      :aria-errormessage="`${field.props.name}-error`"
      :type
      :class="{ 'tw:d-radio': type === 'radio', 'tw:d-checkbox': type === 'checkbox' }"
    />
    <label :for="`${field.props.name}-${value}`" class="tw:d-label tw:truncate">
      {{ label }}
    </label>
  </DefineTemplate>

  <UiFormWrapperVariant v-if="wrapper" :field v-bind="wrapperProps">
    <ReuseTemplate />
  </UiFormWrapperVariant>
  <ReuseTemplate v-else />
</template>

<script lang="ts">
import type { FieldStore, RequiredPath, Schema } from "@formisch/vue";

import type { Id } from "@noties/shared-schema";

import type { WrapperVariantProps } from "./WrapperVariant.vue";

export interface RadioProps {
  type?: "radio" | "checkbox";
  value?: Id;
  label?: string;
  required?: boolean;
}
</script>

<script setup lang="ts" generic="TSchema extends Schema, TFieldPath extends RequiredPath">
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const {
  wrapperProps: wrapper,
  field,
  type = "radio",
  label,
  value,
  required = true,
} = defineProps<RadioProps & { wrapperProps?: WrapperVariantProps; field: FieldStore<TSchema, TFieldPath> }>();
const model = defineModel<Id | null | undefined>({ required: true });

const wrapperProps = computed(() => ({ ...wrapper, required, name: field.props.name, errors: field.errors }));

const checked = computed(() => model.value === value);
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  const isSame = model.value === target.value;
  model.value = type === "checkbox" && isSame ? null : target.value;
};
</script>
