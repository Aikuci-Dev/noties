<template>
  <DefineTemplate>
    <div class="tw:d-validator tw:relative">
      <div
        v-if="multiple && Boolean(selectedOptions.length)"
        class="tw:d-carousel tw:p-2"
        :style="{ width: `${referenceWidth}px` }"
      >
        <div v-auto-animate class="tw:d-carousel-item tw:space-x-2">
          <div
            v-for="{ value, label } in selectedOptions"
            :key="value"
            @click="
              toggleSelectedValue(value);
              cancelClickOutside();
              openFloating();
            "
            class="tw:d-indicator tw:d-badge tw:max-w-40 tw:cursor-pointer tw:hover:d-badge-soft"
            :class="selectedValue === value ? 'tw:d-badge-outline' : 'tw:d-badge-dash'"
          >
            <span class="tw:d-indicator-item tw:rounded tw:bg-base-100">
              <Icon name="lucide:x" @click.stop="removeSelectedValue(value)" class="tw:text-error" />
            </span>
            <p class="tw:truncate">{{ label }}</p>
          </div>
        </div>
      </div>

      <!-- Workaround: Use a wrapper element so Floating UI uses a separate ref -->
      <label
        ref="inputWrapperEl"
        class="tw:d-input tw:w-full"
        :class="{
          'tw:d-input-error': Boolean(field.errors),
          'tw:d-input-success': Boolean(field.isDirty) && Boolean(field.isValid),
        }"
      >
        <!-- Known issue: Formisch and Floating UI both require the same element ref, causing a conflict -->
        <input
          v-model="search"
          v-bind="field.props"
          @focus="
            (e) => {
              field.props.onFocus(e);
              openFloating();
            }
          "
          @click="cancelClickOutside"
          :id="field.props.name"
          :placeholder
          :required
          :aria-invalid="Boolean(field.errors)"
          :aria-errormessage="`${field.props.name}-error`"
        />
      </label>

      <div v-if="open" ref="floatingEl" class="tw:absolute tw:z-10">
        <ul
          class="tw:d-list tw:max-h-[50vh] tw:overflow-y-scroll tw:rounded-box tw:border-2 tw:border-t-0 tw:bg-base-100"
        >
          <template v-if="fuseResults.length > 0">
            <li
              v-for="{ item: { value, label } } in fuseResults"
              :key="value"
              @click="toggleValueSelection(value)"
              class="tw:d-list-row tw:p-2 tw:hover:bg-base-content/10"
            >
              <Icon :class="{ 'tw:opacity-0': !selectedValues.includes(value) }" name="lucide:check" />
              {{ label }}
            </li>
          </template>
          <li v-else class="tw:d-label tw:self-center tw:p-4">No Result Found</li>
        </ul>
      </div>
    </div>
  </DefineTemplate>

  <UiFormWrapperVariant v-if="wrapper" :field v-bind="wrapperProps">
    <ReuseTemplate />
  </UiFormWrapperVariant>
  <ReuseTemplate v-else />

  <div
    v-if="multiple && selectedValues.length > 1"
    tabindex="0"
    class="tw:d-collapse-arrow tw:d-collapse tw:border tw:border-base-300 tw:bg-base-100 tw:shadow-lg"
  >
    <div class="tw:d-collapse-title tw:font-semibold">Reorder Data</div>
    <div class="tw:d-collapse-content">
      <ul v-auto-animate class="tw:d-list tw:rounded-box" :class="'tw:max-h-[50vh] tw:overflow-y-scroll'">
        <li v-for="({ value, label }, index) in selectedOptions" :key="value" class="tw:d-list-row tw:border-b tw:p-2">
          <div class="tw:flex tw:gap-1">
            <Icon name="lucide:arrow-up" @click="onSort(index, 'up')" :class="resolveSortClass(index, 'up')" />
            <Icon name="lucide:arrow-down" @click="onSort(index, 'down')" :class="resolveSortClass(index, 'down')" />
          </div>
          {{ label }}
          <Icon name="lucide:x" @click="removeSelectedValue(value)" class="tw:cursor-pointer tw:text-error" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import type { FieldStore, RequiredPath, Schema } from "@formisch/vue";

import type { Id } from "@noties/shared-schema";

import type { WrapperVariantProps } from "./WrapperVariant.vue";

type Option = { value: Id; label: string };
export type SelectProps = {
  multiple?: true;
  placeholder?: string;
  required?: boolean;
  options?: (Id | Option)[];
};
</script>

<script setup lang="ts" generic="TSchema extends Schema, TFieldPath extends RequiredPath">
import { autoUpdate, size, useFloating } from "@floating-ui/vue";
import { useFuse } from "@vueuse/integrations/useFuse";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const {
  wrapperProps: wrapper,
  field,
  multiple,
  placeholder,
  required = true,
  options: items = [],
} = defineProps<SelectProps & { wrapperProps?: WrapperVariantProps; field: FieldStore }>();
const model = defineModel<Id | Id[] | null | undefined>({ required: true });

const wrapperProps = computed(() => ({ ...wrapper, required, name: field.props.name, errors: field.errors }));

const options = computed(() =>
  items.map((item) => (typeof item === "object" ? item : { value: item, label: String(item) })),
);
const optionMap = computed(() => new Map(options.value.map((option) => [option.value, option])));

// Selection
const selectedValue = ref<Id>();
const selectedValues = computed(() =>
  Array.isArray(model.value) ? model.value : model.value != null ? [model.value] : [],
);
const selectedOption = computed(() => {
  if (selectedValue.value) return optionMap.value.get(selectedValue.value);
});
const selectedOptions = computed(
  () => selectedValues.value.map((v) => optionMap.value.get(v)).filter(Boolean) as Option[],
);

// Toggle
const toggleSelectedValue = (value: Id) => {
  selectedValue.value = selectedValue.value === value ? undefined : value;
};
const toggleValueSelection = (value: Id) => {
  selectedValues.value.includes(value) ? removeSelectedValue(value) : addSelectedValue(value);
};
const addSelectedValue = (value: Id) => {
  model.value = multiple ? (Array.isArray(model.value) ? [...model.value, value] : [value]) : value;
};
const removeSelectedValue = (value: Id) => {
  if (!Array.isArray(model.value)) return;

  model.value = model.value.filter((v) => v !== value);
  if (selectedValue.value === value) {
    selectedValue.value = undefined;
    search.value = "";
  }
};

// Sort
const onSort = (index: number, type: "up" | "down" = "up") => {
  if (!Array.isArray(model.value)) return;

  const target = type === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= selectedValues.value.length) return;

  model.value = move(model.value, index, target);
};

const resolveSortClass = (index: number, type: "up" | "down" = "up") => {
  const disabled = type === "up" ? index === 0 : index === selectedValues.value.length - 1;
  return disabled ? "tw:text-muted tw:cursor-not-allowed" : "tw:cursor-pointer";
};

/** Fuse JS */
const search = ref("");
const { results: fuseResults } = useFuse(search, options, { fuseOptions: { keys: ["label"] } });

/** Floating UI */
const inputWrapperEl = useTemplateRef("inputWrapperEl"); // Reference Element
const floatingEl = useTemplateRef("floatingEl");
const activeFloatingUi = useFloatingUiActive();
const open = computed(() => activeFloatingUi.value === field.props.name);

const referenceWidth = ref(0);
const { width: windowWidth } = useWindowSize();
watch(windowWidth, async () => {
  if (!multiple) return;

  // Tradeoff: UI flickers because Floating UI must be mounted to measure width.
  referenceWidth.value = 0;
  setActiveFloatingUi(field.props.name);
  await nextTick();
  clearActiveFloatingUi();
});
useFloating(inputWrapperEl, floatingEl, {
  open,
  transform: false,
  whileElementsMounted: autoUpdate,
  middleware: [
    size({
      apply({ rects, elements }) {
        const width = rects.reference.width;
        referenceWidth.value = width;
        Object.assign(elements.floating.style, { width: `${width}px` });
      },
    }),
  ],
});
const { cancel: cancelClickOutside } = onClickOutside(floatingEl, clearActiveFloatingUi, {
  controls: true,
  capture: false,
});
const openFloating = () => {
  setActiveFloatingUi(field.props.name);
  search.value = selectedOption.value?.label ?? "";
};
watchEffect(() => {
  if (!open.value) {
    search.value = selectedOptions.value?.map(({ label }) => label).join(", ") ?? "";
    selectedValue.value = undefined;
  }
});

onUnmounted(clearActiveFloatingUi);
</script>
