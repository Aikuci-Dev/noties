<template>
  <DefineTemplate>
    <div class="tw:flex tw:gap-2">
      <input
        v-bind="field.props"
        :id="`${field.props.name}-${value}`"
        :value
        :checked
        @input="handleInput"
        :aria-invalid="Boolean(field.errors)"
        :aria-errormessage="`${field.props.name}-error`"
        type="checkbox"
        class="tw:d-checkbox"
      />
      <label :for="`${field.props.name}-${value}`" class="tw:d-label tw:truncate">
        {{ label }}
      </label>
    </div>
  </DefineTemplate>

  <UiFormWrapperVariant v-if="wrapper" :field v-bind="wrapperProps">
    <ReuseTemplate />
  </UiFormWrapperVariant>
  <ReuseTemplate v-else />
</template>

<script lang="ts">
import type { FieldStore, RequiredPath, Schema } from "@formisch/vue";

import type { Id } from "@relaverse/shared-schema";

import type { WrapperVariantProps } from "./WrapperVariant.vue";

export interface CheckboxProps {
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
  label,
  value,
  required = true,
} = defineProps<CheckboxProps & { wrapperProps?: WrapperVariantProps; field: FieldStore<TSchema, TFieldPath> }>();
const model = defineModel<Id[] | boolean | undefined>({ required: true });

const wrapperProps = computed(() => ({ ...wrapper, required, name: field.props.name, errors: field.errors }));

// Source: https://github.com/open-circle/formisch/blob/main/playgrounds/vue/src/components/Checkbox.vue
const checked = computed(() => {
  if (Array.isArray(model.value)) return value !== undefined && model.value.includes(value);
  return model.value;
});
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (Array.isArray(model.value)) {
    if (value !== undefined) {
      if (target.checked) model.value = [...model.value, value];
      else model.value = model.value.filter((v) => v !== value);
    }
  } else model.value = target.checked;
};
</script>
