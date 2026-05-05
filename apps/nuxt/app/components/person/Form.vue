<template>
  <div class="tw:p-4">
    <UiFormWrapper ref="formWrapperEl" :of="personForm" @submit="handleSubmitForm">
      <template v-slot="{ of }">
        <UiFormFieldSet :of :path="['name']" :wrapperProps="{ label: 'Name' }" />
        <UiFormFieldSet
          :of
          :path="['life_span']"
          :wrapperProps="{ label: 'Life Span' }"
          variant="date-picker"
          :props="{ required: false, range: true }"
        />
        <UiFormFieldSet
          :of
          :path="['gender']"
          :wrapperProps="{ label: 'Gender' }"
          variant="select"
          :props="{ options: [...PERSON_GENDERS], required: false }"
        />
        <UiFormFieldSet
          :of
          :path="['parent']"
          :wrapperProps="{ label: 'Parent' }"
          variant="select"
          :props="{ options: peopleOptions, multiple: true, required: false }"
        />
        <UiFormFieldSet
          :of
          :path="['partners']"
          :wrapperProps="{ label: 'Partners' }"
          variant="select"
          :props="{ options: peopleOptions, multiple: true, required: false }"
        />
        <UiFormFieldSet
          :of
          :path="['children']"
          :wrapperProps="{ label: 'Children' }"
          variant="select"
          :props="{ options: peopleOptions, multiple: true, required: false }"
        />
      </template>
      <template v-if="$slots['action-buttons']" #action-buttons>
        <slot name="action-buttons" />
      </template>
    </UiFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { reset, submit, useForm } from "@formisch/vue";

import type { People, Person, PersonFormSchemaInput, PersonWithMeta } from "@noties/shared-schema";

import { defaultPersonId, PERSON_GENDERS, PersonFormSchema } from "@noties/shared-schema";

const { person, people } = defineProps<{ person?: Person | PersonWithMeta; people: People }>();

const peopleOptions = computed(() => {
  const filtered = person ? people.filter((p) => p.id !== person.id) : people;
  return filtered.map(({ id, name: label }) => ({ value: +id, label }));
});

function getInitialState() {
  return { ...person, id: person?.id ?? defaultPersonId } satisfies PersonFormSchemaInput;
}
const personForm = useForm({
  schema: PersonFormSchema,
  initialInput: getInitialState(),
});

function resetForm() {
  reset(personForm);
}
function submitForm() {
  if (personForm.isSubmitting) return;
  submit(personForm);
}
const handleSubmitForm = (values: typeof PersonFormSchema) => {
  // TODO: Store to DB
  console.log("values", values);
};

const formWrapperEl = useTemplateRef("formWrapperEl");

defineExpose({ formWrapperEl, form: personForm, isSubmitting: personForm.isSubmitting, resetForm, submitForm });
</script>
