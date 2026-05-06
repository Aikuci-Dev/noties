import * as v from "valibot";

import { TransformedUnionDateRangeToIsoSchema } from "../schemas";
import { exactOptionalNullish, normalizeEmptyToNull } from "../utils";
import { defaultPersonId, PersonGenderSchema, PersonIdSchema, PersonIdsSchema, PersonParentSchema } from "./person";

export const PersonFormIdSchema = v.object({
  id: v.exactOptional(PersonIdSchema, defaultPersonId),
  parent: normalizeEmptyToNull(exactOptionalNullish(PersonParentSchema, [])),
  partners: normalizeEmptyToNull(exactOptionalNullish(PersonIdsSchema, [])),
  children: normalizeEmptyToNull(exactOptionalNullish(PersonIdsSchema, [])),
});

export const PersonFormDataSchema = v.object({
  name: v.pipe(v.exactOptional(v.string(), ""), v.nonEmpty("Name is required")),
  gender: exactOptionalNullish(v.nullish(PersonGenderSchema), null),
  life_span: exactOptionalNullish(TransformedUnionDateRangeToIsoSchema, []),
});

export const PersonFormSchema = v.object({ ...PersonFormIdSchema.entries, ...PersonFormDataSchema.entries });

export type PersonFormSchemaInput = v.InferOutput<typeof PersonFormIdSchema> & // correctly infers branded type
  v.InferInput<typeof PersonFormDataSchema>;
export type PersonFormSchemaOutput = v.InferOutput<typeof PersonFormSchema>;
