<script setup lang="ts">
// Adapted from Nuxt UI form docs and example implementation
// Docs: https://ui.nuxt.com/docs/components/form#input-events
// Source: https://github.com/nuxt/ui/blob/v4/docs/app/components/content/examples/form/FormExampleElements.vue

import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const itemSchema = v.object({ label: v.string(), value: v.string() });
type ItemSchema = v.InferInput<typeof itemSchema>;

const schema = v.object({
  input: v.pipe(
    v.string(),
    v.minLength(10, "Must be at least 10 characters"),
  ),

  inputNumber: v.pipe(
    v.number(),
    v.minValue(10, "Must be at least 10"),
  ),

  inputMenu: v.pipe(
    v.optional(itemSchema),
    v.check(
      (option) => option?.value === "option-2",
      "Select Option 2",
    ),
  ),

  inputMenuMultiple: v.pipe(
    v.array(itemSchema),
    v.nonEmpty("Input Menu Multiple is required"),
    v.check(
      (values) => values.some((option) => option.value === "option-2"),
      "Include Option 2",
    ),
  ),

  textarea: v.pipe(
    v.string(),
    v.minLength(10, "Must be at least 10 characters"),
  ),

  select: v.pipe(
    v.string(),
    v.check((value) => value === "option-2", "Select Option 2"),
  ),

  selectMultiple: v.pipe(
    v.array(v.string()),
    v.nonEmpty("Select Multiple is required"),
    v.check(
      (values) => values.includes("option-2"),
      "Include Option 2",
    ),
  ),

  selectMenu: v.pipe(
    v.optional(itemSchema),
    v.check(
      (option) => option?.value === "option-2",
      "Select Option 2",
    ),
  ),

  selectMenuMultiple: v.pipe(
    v.array(itemSchema),
    v.nonEmpty("Select Menu Multiple is required"),
    v.check(
      (values) => values.some((option) => option.value === "option-2"),
      "Include Option 2",
    ),
  ),

  switch: v.pipe(
    v.boolean(),
    v.check((value) => value === true, "Toggle me"),
  ),

  checkbox: v.pipe(
    v.boolean(),
    v.check((value) => value === true, "Check me"),
  ),

  radioGroup: v.pipe(
    v.string(),
    v.check((value) => value === "option-2", "Select Option 2"),
  ),

  checkboxGroup: v.pipe(
    v.array(v.string()),
    v.nonEmpty("Checkbox Group is required"),
    v.check(
      (values) => values.includes("option-2"),
      "Include Option 2",
    ),
  ),

  slider: v.pipe(
    v.number(),
    v.maxValue(20, "Must be less than 20"),
  ),

  pin: v.pipe(
    v.array(
      v.pipe(
        v.string(),
        v.regex(/^\d$/, "Must be a single digit"),
      ),
    ),
    v.nonEmpty("Pin Input is required"),
    v.length(5, "PIN must be exactly 5 digits"),
  ),

  file: v.pipe(
    v.file("File is required"),
    v.maxSize(1024 * 1024, "File must be less than 1MB"),
    v.mimeType(["image/png"], "Only PNG files are allowed"),
  ),
});
type Schema = v.InferInput<typeof schema>;

const state = reactive<Schema>({
  input: "",
  inputNumber: 0,
  inputMenu: undefined,
  inputMenuMultiple: [],
  textarea: "",
  select: "",
  selectMultiple: [],
  selectMenu: undefined,
  selectMenuMultiple: [],
  switch: false,
  checkbox: false,
  radioGroup: "",
  checkboxGroup: [],
  slider: 0,
  pin: [],
  // @ts-ignore: initial form state allows undefined, validated later by schema
  file: undefined,
});

const form = useTemplateRef("form");

const items: ItemSchema[] = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
];

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}
</script>

<template>
  <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit">
    <div class="tw:gap-4 tw:grid tw:grid-cols-3">
      <UFormField label="Input" name="input">
        <UInput v-model="state.input" placeholder="john@lennon.com" class="tw:w-full" />
      </UFormField>

      <UFormField name="inputNumber" label="Input Number">
        <UInputNumber v-model="state.inputNumber" class="tw:w-full" />
      </UFormField>

      <UFormField name="pin" label="Pin Input" :error-pattern="/(pin)\..*/">
        <UPinInput v-model="state.pin" />
      </UFormField>

      <UFormField name="select" label="Select">
        <USelect v-model="state.select" :items="items" class="tw:w-full" />
      </UFormField>

      <UFormField name="selectMultiple" label="Select (Multiple)">
        <USelect v-model="state.selectMultiple" multiple :items="items" class="tw:w-full" />
      </UFormField>

      <UFormField name="selectMenu" label="Select Menu">
        <USelectMenu v-model="state.selectMenu" :items="items" class="tw:w-full" />
      </UFormField>

      <UFormField name="selectMenuMultiple" label="Select Menu (Multiple)">
        <USelectMenu v-model="state.selectMenuMultiple" multiple :items="items" class="tw:w-full" />
      </UFormField>

      <UFormField name="inputMenu" label="Input Menu">
        <UInputMenu v-model="state.inputMenu" :items="items" class="tw:w-full" />
      </UFormField>

      <UFormField name="inputMenuMultiple" label="Input Menu (Multiple)">
        <UInputMenu v-model="state.inputMenuMultiple" multiple :items="items" class="tw:w-full" />
      </UFormField>

      <UFormField label="Textarea" name="textarea">
        <UTextarea v-model="state.textarea" class="tw:w-full" />
      </UFormField>

      <div class="tw:flex tw:justify-around">
        <UFormField name="radioGroup">
          <URadioGroup v-model="state.radioGroup" legend="Radio group" :items="items" />
        </UFormField>
        <UFormField name="checkboxGroup">
          <UCheckboxGroup v-model="state.checkboxGroup" legend="Checkbox group" :items="items" />
        </UFormField>
      </div>

      <div class="tw:flex tw:justify-around tw:items-center">
        <UFormField name="switch">
          <USwitch v-model="state.switch" label="Switch me" />
        </UFormField>

        <UFormField name="checkbox">
          <UCheckbox v-model="state.checkbox" label="Check me" />
        </UFormField>
      </div>

      <UFormField name="slider" label="Slider">
        <USlider v-model="state.slider" />
      </UFormField>

      <UFormField name="file" label="File Input">
        <UFileUpload v-model="state.file" label="Drop your image here" description="PNG (max. 1MB)" />
      </UFormField>
    </div>

    <div class="tw:flex tw:gap-2 tw:mt-8">
      <UButton type="submit">
        Submit
      </UButton>

      <UButton variant="outline" @click="form?.clear()">
        Clear
      </UButton>
    </div>
  </UForm>
</template>
