import * as v from "valibot";

import { IntegerSchema, IsoDateSchema } from "@/schemas";
import { exactOptionalUndefinable } from "@/utils";

/**
 * =========================
 * PROPERTIES
 * =========================
 */
export const PersonIdSchema = v.pipe(IntegerSchema, v.brand("PersonId"));
export const PersonIdsSchema = v.pipe(v.array(PersonIdSchema));
export const PersonParentSchema = v.pipe(PersonIdsSchema, v.maxLength(2));
export const PERSON_GENDERS = ["M", "F"] as const;
export const PersonGenderSchema = v.picklist(PERSON_GENDERS);

/**
 * =========================
 * DEFAULT
 * =========================
 */
export const defaultPersonId = v.parse(PersonIdSchema, 0);

/**
 * =========================
 * ENTITY
 * =========================
 */
export const PersonSchema = v.object({
  id: PersonIdSchema,

  parentIds: v.nullish(PersonParentSchema),
  partnerIds: v.nullish(v.array(PersonIdSchema)),
  childrenIds: v.nullish(v.array(PersonIdSchema)),

  name: v.string(),

  gender: v.nullish(PersonGenderSchema),
  dateOfBirth: v.nullish(IsoDateSchema),
  dateOfDeath: v.nullish(IsoDateSchema),
});
export const PersonMetaSchema = v.object({
  partnerId: v.exactOptional(PersonIdSchema), // Current Partner
  generationOrder: exactOptionalUndefinable(v.number()),
});
export const PersonWithMetaSchema = v.object({ ...PersonSchema.entries, meta: PersonMetaSchema });

export type PersonSchemaInput = v.InferInput<typeof PersonSchema>;
export type PersonSchemaOutput = v.InferOutput<typeof PersonSchema>;
