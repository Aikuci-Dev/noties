<template>
  <UForm ref="formEl" :state :schema="PersonFormSchema" @submit='$emit("submit")'>
    <div class="tw:gap-2 tw:grid">
      <UFormField name="name" label="Name">
        <UInput v-model="state.name" placeholder="Name" class="tw:w-full" />
      </UFormField>
      <UFormField name="life_span" label="Life span (birth–death)">
        <UInputDate ref="inputDate" v-model="state.life_span" range class="tw:w-full">
          <template #trailing>
            <UPopover
              class="tw:w-full"
              :content='{ align: "end" }'
            >
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-calendar"
                aria-label="Open calendar to select birth and death dates"
                class="tw:px-0"
              />

              <template #content>
                <UCalendar v-model="state.life_span" class="tw:p-2 tw:w-full" range />
              </template>
            </UPopover>
          </template>
        </UInputDate>
      </UFormField>

      <UFormField name="gender" label="Gender">
        <USelectMenu v-model="state.gender" :items='["M", "F"]' class="tw:w-full" clear />
      </UFormField>

      <UFormField name="parent" label="Parent">
        <USelectMenu
          v-model="state.parent"
          multiple
          value-key="id"
          label-key="name"
          :items="peopleOptions"
          class="tw:w-full"
          clear
        />
      </UFormField>
      <UFormField name="partner" label="Partner">
        <USelectMenu
          v-model="state.partners"
          multiple
          value-key="id"
          label-key="name"
          :items="peopleOptions"
          class="tw:w-full"
          clear
        />
      </UFormField>
      <UFormField name="children" label="Children">
        <USelectMenu
          v-model="state.children"
          multiple
          value-key="id"
          label-key="name"
          :items="peopleOptions"
          class="tw:w-full"
          clear
        />
      </UFormField>
    </div>

    <slot name="action-buttons">
      <div class="tw:flex tw:justify-end">
        <UButton type="submit" label="Submit" color="success" />
      </div>
    </slot>
  </UForm>
</template>

<script setup lang="ts">
import { parseDate } from "@internationalized/date";

import type { People, Person, PersonWithMeta } from "@noties/shared-schema";
import type { PersonFormSchemaInput, PersonFormSchemaOutput } from "@noties/shared-schema";
import { defaultPersonId, PersonFormSchema } from "@noties/shared-schema";

const { person, people } = defineProps<{ person?: Person | PersonWithMeta; people: People }>();

const peopleOptions = computed(() => {
  if (person) return people.filter((p) => p.id !== person.id);
  else return people;
});

function getInitialState() {
  return {
    ...person,
    id: person?.id ?? defaultPersonId,
    parent: person?.parentIds ?? undefined,
    partners: person?.partnerIds ?? [], // Nuxt UI does not support null value for array data
    children: person?.childrenIds ?? [], // Nuxt UI does not support null value for array data
    life_span: {
      start: person?.dateOfBirth && parseDate(person?.dateOfBirth),
      end: person?.dateOfDeath && parseDate(person?.dateOfDeath),
    },
  } satisfies PersonFormSchemaInput;
}
const state = ref<Partial<PersonFormSchemaInput>>(getInitialState());
function resetForm() {
  state.value = getInitialState();
}

const formEl = useTemplateRef("formEl");
function validateForm({ transform }: { transform: boolean } = { transform: true }) {
  return formEl.value?.validate({ silent: true, transform });
}

defineExpose<FormInstance<PersonFormSchemaInput, PersonFormSchemaOutput>>({
  resetForm,
  // @ts-expect-error Valibot branded type inferred via InferOutput (Nuxt UI Form uses InferInput)
  // See: https://valibot.dev/guides/infer-types/#infer-output-types
  validateForm,
});
</script>
