<script setup lang="ts">
import * as v from "valibot";

const schema = v.pipe(
  v.object({
    title: v.string(),
    subtitle: v.optional(v.string()),
    gender: v.nullish(v.picklist(GENDER)),
    isDead: v.boolean(),
    parent: v.optional(
      v.pipe(
        v.array(v.number()),
        v.maxLength(2, "Max parent are 2"),
      ),
    ),
    partner: v.optional(v.array(v.number())),
    children: v.optional(v.array(v.number())),
  }),
  // Known issue: https://github.com/nuxt/ui/issues/5932
  v.forward(
    v.partialCheck(
      [["partner"], ["children"]],
      (input) => !(input.children?.length && !input.partner?.length),
      "Person should have a partner if they have children",
    ),
    ["children"],
  ),
);
type Schema = v.InferInput<typeof schema>;

const state = reactive<Schema>({
  title: "",
  subtitle: undefined,
  gender: undefined,
  isDead: false,
  parent: undefined,
  partner: undefined,
  children: undefined,
});

const formEl = useTemplateRef("formEl");

function validateForm() {
  return formEl.value?.validate({ silent: true });
}

const { person, people } = defineProps<{ person?: Person; people: People }>();
const peopleOptions = computed(() => {
  if (person) return people.filter((p) => p.id !== person.id);
  else return people;
});

defineExpose({ formEl, validateForm });
</script>

<template>
  <UForm ref="formEl" :state :schema @submit='$emit("submit")'>
    <div class="tw:gap-2 tw:grid">
      <UFormField name="title" label="Name">
        <UInput v-model="state.title" placeholder="Name" class="tw:w-full" />
      </UFormField>
      <UFormField name="subtitle" label="Life Year">
        <UInput v-model="state.subtitle" :placeholder="`${new Date().getFullYear()} - now`" class="tw:w-full" />
      </UFormField>

      <UFormField name="gender" label="Gender">
        <USelectMenu v-model="state.gender" :items='["M", "F"]' class="tw:w-full" clear />
      </UFormField>
      <UFormField name="isDead">
        <USwitch v-model="state.isDead" label="Is Dead?" />
      </UFormField>

      <UFormField name="parent" label="Parent">
        <USelectMenu
          v-model="state.parent"
          multiple
          value-key="id"
          label-key="title"
          :items="people"
          class="tw:w-full"
          clear
        />
      </UFormField>
      <UFormField name="partner" label="Partner">
        <USelectMenu
          v-model="state.partner"
          multiple
          value-key="id"
          label-key="title"
          :items="people"
          class="tw:w-full"
          clear
        />
      </UFormField>
      <UFormField name="children" label="Children">
        <USelectMenu
          v-model="state.children"
          multiple
          value-key="id"
          label-key="title"
          :items="people"
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
