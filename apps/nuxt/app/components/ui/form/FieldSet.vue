<template>
  <fieldset class="tw:d-fieldset tw:p-4">
    <field :of :path #default="field">
      <slot>
        <component
          :is="FormFieldVariantComponentMap[variant ?? 'input']"
          v-bind="props"
          v-model="field.input"
          :wrapperProps
          :field="{
            ...field,
            props: {
              ...field.props,
              onFocus: composeEventHandlers(field.props.onFocus, clearActiveFloatingUi),
            },
          }"
        />
      </slot>
    </field>
  </fieldset>
</template>

<script setup lang="ts" generic="TSchema extends Schema, TFieldPath extends RequiredPath">
import type { FormStore, PathValue, RequiredPath, Schema, ValidPath } from "@formisch/vue";

import { Field } from "@formisch/vue";
import * as v from "valibot";

import type { FormFieldVariantProps } from "./variant";

import { FormFieldVariantComponentMap } from "./variant";

// Source: https://github.com/open-circle/formisch/blob/main/frameworks/vue/src/components/Field/Field.vue
interface FormischFieldProps<TSchema extends Schema = Schema, TFieldPath extends RequiredPath = RequiredPath> {
  readonly of: FormStore<TSchema>;
  readonly path: ValidPath<v.InferInput<TSchema>, TFieldPath>;
}

const { of, path, variant, props, wrapperProps } = defineProps<
  FormischFieldProps<TSchema, TFieldPath> & FormFieldVariantProps<PathValue<v.InferInput<TSchema>, TFieldPath>>
>();
</script>
