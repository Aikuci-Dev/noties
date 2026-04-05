import * as v from "valibot";
import { CalendarDate } from "@internationalized/date";

import { exactOptionalNullish, exactOptionalUndefinedable } from "../utils";

import { defaultPersonId, PersonGenderSchema, PersonIdSchema, PersonParentSchema } from "./person";

export const PersonFormIdSchema = v.object({
  id: v.exactOptional(PersonIdSchema, defaultPersonId),
  parent: PersonParentSchema,
  partners: exactOptionalUndefinedable(v.array(PersonIdSchema), []), // TODO: Replace `undefinedable` with `nullish` for consistency with the actual schema
  children: exactOptionalUndefinedable(v.array(PersonIdSchema), []), // Currently we do not accept `null` because Nuxt UI does not support it
});

export const PersonFormDataSchema = v.object({
  name: v.pipe(v.exactOptional(v.string(), ""), v.nonEmpty("Name is required")),
  gender: exactOptionalNullish(v.nullish(PersonGenderSchema), null),
  life_span: v.pipe(
    exactOptionalNullish(v.object({
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

        if (birth_date != null && !(birth_date instanceof CalendarDate)) {
          addIssue({
            message: "Invalid Date of Birth.",
            path: [getPath("start")],
          });
          return NEVER;
        }
        if (death_date != null && !(death_date instanceof CalendarDate)) {
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
});

export const PersonFormSchema = v.pipe(
  v.object({
    ...PersonFormIdSchema.entries,
    ...PersonFormDataSchema.entries,
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

export type PersonFormSchemaInput =
  & v.InferOutput<typeof PersonFormIdSchema> // correctly infers branded type
  & v.InferInput<typeof PersonFormDataSchema>;
export type PersonFormSchemaOutput = v.InferOutput<typeof PersonFormSchema>;
