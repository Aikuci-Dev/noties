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
          :props="{ options: [...Human.GENDERS], required: false }"
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

import { Human } from "@noties/shared-schema";

type PersonSchema = Human.FamilyTree.Schema;
type FormSchema = Human.FamilyTree.FormSchemaInput;

const { fallbackId, person, people } = defineProps<{
  fallbackId?: Human.IdSchema;
  person?: PersonSchema;
  people: Human.People<PersonSchema>;
}>();

const emits = defineEmits(["settled"]);

const peopleOptions = computed(() => {
  const filtered = person ? people.filter((p) => p.id !== person.id) : people;
  return filtered.map(({ id, name: label }) => ({ value: +id, label }));
});

function getInitialState() {
  if (person) {
    const { meta, dateOfBirth, dateOfDeath, parentIds, partnerIds, childrenIds, ...rest } = person;
    return {
      ...rest,
      life_span: dateOfBirth ? (dateOfDeath ? [dateOfBirth, dateOfDeath] : [dateOfBirth]) : [],
      parent: parentIds,
      partners: partnerIds,
      children: childrenIds,
      id: rest.id,
    } satisfies FormSchema;
  }
}
const personForm = useForm({
  schema: Human.FamilyTree.FormSchemaOutput,
  initialInput: getInitialState(),
});

function resetForm() {
  reset(personForm);
}
function submitForm() {
  if (personForm.isSubmitting) return;
  submit(personForm);
}
const handleSubmitForm = (values: Human.FamilyTree.FormSchemaOutput) => {
  const { parent, partners, children, life_span, ...rest } = values;
  const payload = {
    ...rest,
    dateOfBirth: life_span?.[0] ? new Date(life_span[0]).toISOString() : null,
    dateOfDeath: life_span?.[1] ? new Date(life_span[1]).toISOString() : null,
    parentIds: parent,
    partnerIds: partners,
    childrenIds: children,
    meta: { kind: Human.KINDS.FamilyTree, partnerId: partners?.[0] },
  } satisfies Human.FamilyTree.Schema;

  if (payload.id) familyTreeCollection.update(payload.id, (draft) => Object.assign(draft, payload));
  else familyTreeCollection.insert({ ...payload, id: fallbackId as Human.IdSchema });

  emits("settled");
};

const formWrapperEl = useTemplateRef("formWrapperEl");

defineExpose({ formWrapperEl, form: personForm, isSubmitting: personForm.isSubmitting, resetForm, submitForm });
</script>
