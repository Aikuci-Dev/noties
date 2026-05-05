<template>
  <DefineTemplate>
    <!-- See MDN: limitations of <select> size https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#size -->
    <select
      v-model="model"
      v-bind="field.props"
      :id="field.props.name"
      :size="1"
      :multiple
      :required
      class="tw:d-validator tw:d-select tw:w-full"
      :class="{ 'tw:appearance-none': multiple }"
      :aria-invalid="Boolean(field.errors)"
      :aria-errormessage="`${field.props.name}-error`"
    >
      <option :value="null" disabled hidden :selected="isEmpty(model)">
        {{ placeholder }}
      </option>
      <option
        v-for="{ value, label } in options"
        :key="JSON.stringify(value)"
        :value
        :selected="values.includes(value)"
      >
        {{ label }}
      </option>
    </select>
  </DefineTemplate>

  <UiFormWrapperVariant v-if="wrapper" :field v-bind="wrapperProps">
    <ReuseTemplate />
  </UiFormWrapperVariant>
  <ReuseTemplate v-else />
</template>

<script lang="ts">
import type { FieldStore, RequiredPath, Schema } from "@formisch/vue";

import type { Id } from "@noties/shared-schema";

import { isEmpty } from "@noties/shared-util";

import type { WrapperVariantProps } from "./WrapperVariant.vue";

type Option = { value: Id; label: string };
export interface SelectProps {
  multiple?: true;
  placeholder?: string;
  required?: boolean;
  options?: (Id | Option)[];
}
</script>

<script setup lang="ts" generic="TSchema extends Schema, TFieldPath extends RequiredPath">
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const {
  wrapperProps: wrapper,
  field,
  multiple,
  placeholder,
  required = true,
  options: items = [],
} = defineProps<SelectProps & { wrapperProps?: WrapperVariantProps; field: FieldStore }>();
const model = defineModel<Id | Id[] | null | undefined>({ required: true });

const wrapperProps = computed(() => ({ ...wrapper, required, name: field.props.name, errors: field.errors }));

const options = computed(() =>
  items.map((item) => (typeof item === "object" ? item : { value: item, label: String(item) })),
);
const values = computed(() => (Array.isArray(model.value) ? model.value : model.value ? [model.value] : []));
</script>
