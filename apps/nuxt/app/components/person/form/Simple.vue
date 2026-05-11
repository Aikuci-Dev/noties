<template>
  <div class="tw:p-4">
    <UiFormWrapper ref="formWrapperEl" :of="personForm" @submit="handleSubmitForm">
      <template v-slot="{ of }">
        <UiFormFieldSet :of :path="['name']" :wrapperProps="{ label: 'Name' }" />
        <UiFormFieldSet
          :of
          :path="['gender']"
          :wrapperProps="{ label: 'Gender' }"
          variant="select"
          :props="{ options: [...Human.GENDERS], required: false }"
        />
        <UiFormFieldSet
          :of
          :path="['isAccent']"
          :wrapperProps="{ label: 'Accent' }"
          variant="checkbox"
          :props="{ label: 'Mark this as an accent', required: false }"
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

import { Human } from "@noties/shared-schema";

type PersonSchema = Human.Simple.Schema;

const { fallbackId, person, people } = defineProps<{
  fallbackId?: Human.IdSchema;
  person?: PersonSchema;
  people: Human.People<PersonSchema>;
}>();

const emits = defineEmits(["error", "success"]);

const peopleOptions = computed(() => {
  const filtered = person ? people.filter((p) => p.id !== person.id) : people;
  return filtered.map(({ id, name: label }) => ({ value: +id, label }));
});

const personForm = useForm({
  schema: Human.Simple.FormSchemaOutput,
  initialInput: person ? Human.schemaToFormSchema(Human.KINDS.Simple, person) : undefined,
});

function resetForm() {
  reset(personForm);
}
function submitForm() {
  if (personForm.isSubmitting) return;
  submit(personForm);
}
const handleSubmitForm = (values: Human.Simple.FormSchemaOutput) => {
  try {
    const payload = Human.formToSchema(Human.KINDS.Simple, values);
    if (payload.id) simpleCollection.update(payload.id, (draft) => Object.assign(draft, payload));
    else simpleCollection.insert({ ...payload, id: fallbackId as Human.IdSchema });
    emits("success");
  } catch (error) {
    emits("error", error);
  }
};

const formWrapperEl = useTemplateRef("formWrapperEl");

defineExpose({ formWrapperEl, form: personForm, isSubmitting: personForm.isSubmitting, resetForm, submitForm });
</script>
