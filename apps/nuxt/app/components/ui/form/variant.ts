import type { DateLike } from "@vueuse/core";

import type { Id } from "@noties/shared-schema";

import type { CustomSelectProps } from "./VariantCustomSelect.vue";
import type { DatePickerProps } from "./VariantDatePicker.vue";
import type { InputProps } from "./VariantInput.vue";
import type { WrapperVariantProps } from "./WrapperVariant.vue";

type FormFieldVariant = "date-picker" | "input" | "custom-select";
type FormFieldVariantPropsMap<T> = {
  "date-picker": T extends DateLike[]
    ? DatePickerProps & { range: true }
    : T extends DateLike
      ? DatePickerProps & { range?: never }
      : never;
  input: InputProps;
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

import FormFieldCustomSelect from "./VariantCustomSelect.vue";
import FormFieldDatePicker from "./VariantDatePicker.vue";
import FormFieldInput from "./VariantInput.vue";

export const FormFieldVariantComponentMap: { [V in FormFieldVariant]: Component } = {
  "date-picker": FormFieldDatePicker,
  input: FormFieldInput,
  "custom-select": FormFieldCustomSelect,
} as const;
