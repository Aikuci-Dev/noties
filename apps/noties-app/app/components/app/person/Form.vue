<template>
  <UForm ref="formEl" :state :schema="FormSchema" @submit='$emit("submit")'>
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

<script lang="ts">
import * as v from "valibot";
import { CalendarDate, parseDate } from "@internationalized/date";

const ParentSchema = v.optional(v.union([v.tuple([v.number()]), v.tuple([v.number(), v.number()])]));

const FormSchema = v.pipe(
  v.object({
    id: v.optional(v.number(), 0),
    name: v.pipe(exactOptionalUndefinedable(v.string(), ""), v.nonEmpty("Name is required")),
    life_span: v.pipe(
      v.optional(v.object({
        start: v.pipe(v.any(), v.title("birth_date")),
        end: v.pipe(v.any(), v.title("death_date")),
      })),
      v.rawTransform(
        ({ dataset, addIssue, NEVER }) => {
          if (!dataset.value) return NEVER;

          const birth_date = dataset.value.start;
          const death_date = dataset.value.end;

          function getPath(key: "start" | "end"): v.IssuePathItem {
            if (!dataset.value) return NEVER;

            return {
              type: "object",
              origin: "value",
              input: dataset.value,
              key,
              value: dataset.value[key],
            };
          }

          if (birth_date !== undefined && !(birth_date instanceof CalendarDate)) {
            addIssue({
              message: "Invalid Date of Birth.",
              path: [getPath("start")],
            });
            return NEVER;
          }
          if (death_date !== undefined && !(death_date instanceof CalendarDate)) {
            addIssue({
              message: "Invalid Date of Death.",
              path: [getPath("end")],
            });
            return NEVER;
          }

          return { birth_date, death_date };
        },
      ),
    ),
    gender: v.optional(v.nullish(v.picklist(GENDER)), null),
    parent: ParentSchema,
    partners: v.optional(v.array(v.number()), []),
    children: v.optional(v.array(v.number()), []),
  }),
  v.transform(({ name, life_span, parent, ...rest }) => ({
    ...rest,
    title: name,
    subtitle: `${life_span?.birth_date?.year ?? ""}-${life_span?.death_date?.year ?? ""}`,
    birthOfDate: life_span?.birth_date?.toString() ?? null,
    deathOfDate: life_span?.death_date?.toString() ?? null,
    parent: parent ?? null, // Since Nuxt UI does not support null value for array data, so manually transform undefined into null
  })),
);

export type FormSchemaInput = v.InferInput<typeof FormSchema>;
export type FormSchemaOutput = v.InferOutput<typeof FormSchema>;
</script>

<script setup lang="ts">
const { person, people } = defineProps<{ person?: Person | PersonWithMeta; people: People }>();

const peopleOptions = computed(() => {
  if (person) return people.filter((p) => p.id !== person.id);
  else return people;
});

function getInitialState() {
  return {
    ...person,
    parent: person?.parentIds ?? undefined,
    partners: person?.partnerIds ?? [], // Nuxt UI does not support null value for array data
    children: person?.childrenIds ?? [], // Nuxt UI does not support null value for array data
    life_span: {
      start: person?.dateOfBirth && parseDate(person?.dateOfBirth),
      end: person?.dateOfDeath && parseDate(person?.dateOfDeath),
    },
  } satisfies FormSchemaInput;
}
const state = ref<Partial<FormSchemaInput>>(getInitialState());
function resetForm() {
  state.value = getInitialState();
}

const formEl = useTemplateRef("formEl");
function validateForm({ transform }: { transform: boolean } = { transform: true }) {
  return formEl.value?.validate({ silent: true, transform });
}

defineExpose<FormInstance<FormSchemaInput, FormSchemaOutput>>({ resetForm, validateForm });
</script>
