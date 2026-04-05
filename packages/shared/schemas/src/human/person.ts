import * as v from "valibot";

import { exactOptionalUndefinedable, IntegerSchema, IsoDateSchema } from "../common";

/**
 * =========================
 * PROPERTIES
 * =========================
 */
export const PersonIdSchema = v.pipe(IntegerSchema, v.brand("PersonId"));
export const PersonParentSchema = exactOptionalUndefinedable(
  v.union([v.tuple([PersonIdSchema]), v.tuple([PersonIdSchema, PersonIdSchema])]),
);
export const PersonGenderSchema = v.picklist(["M", "F"]);

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
  generationOrder: exactOptionalUndefinedable(v.number()),
});
export const PersonWithMetaSchema = v.object({ ...PersonSchema.entries, meta: PersonMetaSchema });
