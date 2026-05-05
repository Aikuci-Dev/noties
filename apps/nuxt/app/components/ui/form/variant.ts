import type { Id } from "@noties/shared-schema";

import type { CheckboxProps } from "./VariantCheckbox.vue";
import type { InputProps } from "./VariantInput.vue";
import type { RadioProps } from "./VariantRadio.vue";
import type { SelectProps } from "./VariantSelect.vue";
import type { WrapperVariantProps } from "./WrapperVariant.vue";

type FormFieldVariant = "checkbox" | "input" | "radio" | "select";
type FormFieldVariantPropsMap<T> = {
  checkbox: CheckboxProps;
  input: InputProps;
  radio: RadioProps;
  select: T extends Id[] ? SelectProps & { multiple: true } : T extends Id ? SelectProps & { multiple?: never } : never;
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
import FormFieldInput from "./VariantInput.vue";
import FormFieldRadio from "./VariantRadio.vue";
import FormFieldSelect from "./VariantSelect.vue";

export const FormFieldVariantComponentMap: { [V in FormFieldVariant]: Component } = {
  checkbox: FormFieldCheckbox,
  input: FormFieldInput,
  radio: FormFieldRadio,
  select: FormFieldSelect,
} as const;
