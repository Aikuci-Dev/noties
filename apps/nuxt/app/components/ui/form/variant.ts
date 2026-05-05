import type { DateLike } from "@vueuse/core";

import type { Id } from "@noties/shared-schema";

import type { CheckboxProps } from "./VariantCheckbox.vue";
import type { CustomSelectProps } from "./VariantCustomSelect.vue";
import type { DatePickerProps } from "./VariantDatePicker.vue";
import type { InputProps } from "./VariantInput.vue";
import type { RadioProps } from "./VariantRadio.vue";
import type { SelectProps } from "./VariantSelect.vue";
import type { WrapperVariantProps } from "./WrapperVariant.vue";

type FormFieldVariant = "checkbox" | "date-picker" | "input" | "radio" | "select" | "custom-select";
type FormFieldVariantPropsMap<T> = {
  checkbox: CheckboxProps;
  "date-picker": T extends DateLike[]
    ? DatePickerProps & { range: true }
    : T extends DateLike
      ? DatePickerProps & { range?: never }
      : never;
  input: InputProps;
  radio: RadioProps;
  select: T extends Id[] ? SelectProps & { multiple: true } : T extends Id ? SelectProps & { multiple?: never } : never;
  "custom-select": T extends Id[]
    ? CustomSelectProps & { multiple: true }
    : T extends Id
      ? CustomSelectProps & { multiple?: never }
      : never;
};
export type FormFieldVariantProps<T> = {
  [V in FormFieldVariant]: {
    variant?: V;
    wrapperProps?: Pick<WrapperVariantProps, "label" | "description">;
    props?: FormFieldVariantPropsMap<T>[V];
  };
}[FormFieldVariant];

// END Type

import FormFieldCheckbox from "./VariantCheckbox.vue";
import FormFieldCustomSelect from "./VariantCustomSelect.vue";
import FormFieldDatePicker from "./VariantDatePicker.vue";
import FormFieldInput from "./VariantInput.vue";
import FormFieldRadio from "./VariantRadio.vue";
import FormFieldSelect from "./VariantSelect.vue";

export const FormFieldVariantComponentMap: { [V in FormFieldVariant]: Component } = {
  checkbox: FormFieldCheckbox,
  "date-picker": FormFieldDatePicker,
  input: FormFieldInput,
  radio: FormFieldRadio,
  select: FormFieldSelect,
  "custom-select": FormFieldCustomSelect,
} as const;
