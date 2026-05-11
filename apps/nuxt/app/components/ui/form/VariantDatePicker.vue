<template>
  <DefineTemplate>
    <div class="tw:d-validator tw:relative">
      <label
        ref="inputWrapperEl"
        class="tw:d-input tw:w-full"
        :class="{
          'tw:d-input-error': Boolean(field.errors),
          'tw:d-input-success': Boolean(field.isDirty) && Boolean(field.isValid),
        }"
      >
        <input
          :value="formattedDate"
          v-bind="field.props"
          @focus="
            (e) => {
              field.props.onFocus(e);
              openFloating();
            }
          "
          @click="cancelClickOutside"
          :id="field.props.name"
          readonly
          :placeholder
          :required
          :aria-invalid="Boolean(field.errors)"
          :aria-errormessage="`${field.props.name}-error`"
        />
      </label>
      <div ref="floatingEl" v-if="open" class="w-full tw:absolute tw:z-10 tw:bg-accent" :style="floatingStyles">
        <wc-datepicker
          ref="datepickerEl"
          :value="datePickerValue"
          :range
          :start-date
          show-clear-button
          show-year-stepper
          @selectDate="onSelect"
        />
      </div>
    </div>
  </DefineTemplate>

  <UiFormWrapperVariant v-if="wrapper" :field v-bind="wrapperProps">
    <ReuseTemplate />
  </UiFormWrapperVariant>
  <ReuseTemplate v-else />
</template>

<script lang="ts">
import type { FieldStore, RequiredPath, Schema } from "@formisch/vue";
import type { DateLike } from "@vueuse/core";
import type { ShallowRef } from "vue";

import { isDefined, removeFalsy } from "@relaverse/shared-util";

import type { WrapperVariantProps } from "./WrapperVariant.vue";

export interface DatePickerProps {
  range?: true;
  placeholder?: string;
  required?: boolean;
}
</script>

<script setup lang="ts" generic="TSchema extends Schema, TFieldPath extends RequiredPath">
import { autoUpdate, useFloating } from "@floating-ui/vue";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const {
  wrapperProps: wrapper,
  field,
  range,
  placeholder,
  required = true,
} = defineProps<DatePickerProps & { wrapperProps?: WrapperVariantProps; field: FieldStore<TSchema, TFieldPath> }>();
const model = defineModel<DateLike | [DateLike, DateLike] | null | undefined>({ required: true });

const wrapperProps = computed(() => ({ ...wrapper, required, name: field.props.name, errors: field.errors }));

const formattedDate = computed(() => {
  if (!isDefined(model.value)) return;

  if (Array.isArray(model.value)) {
    const [start, end] = removeFalsy(model.value).map(formatDate);
    return end ? `${start} - ${end}` : start;
  }
  return formatDate(model.value);
});
const formatDate = (dateValue: NonNullable<DateLike>) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));

// Date Picker
const datepickerEl: Readonly<ShallowRef> = useTemplateRef("datepickerEl");

const datePickerValue = computed(() => {
  if (!isDefined(model.value)) return;

  if (Array.isArray(model.value)) return removeFalsy(model.value).map((v) => new Date(v));
  return new Date(model.value);
});

const startDate = computed(() => {
  if (Array.isArray(model.value)) return model.value[0];
  return model.value;
});

const onSelect = (event: { detail?: string | [string, string] }) => {
  model.value = event.detail;
};

/** Floating UI */
const inputWrapperEl = useTemplateRef("inputWrapperEl"); // Reference Element
const floatingEl = useTemplateRef("floatingEl");
const activeFloatingUi = useFloatingUiActive();
const open = computed(() => activeFloatingUi.value === field.props.name);

const { floatingStyles } = useFloating(inputWrapperEl, floatingEl, {
  open,
  whileElementsMounted: autoUpdate,
  placement: "bottom",
});

const openFloating = () => {
  setActiveFloatingUi(field.props.name);
};
const { cancel: cancelClickOutside } = onClickOutside(datepickerEl, clearActiveFloatingUi, { controls: true });

onUnmounted(clearActiveFloatingUi);
</script>
