import * as v from "valibot";

import { IsoTimestampSchema } from "@/schemas/app";
import { exactOptionalUndefinable } from "@/utils/valibot";

import { IdSchema, IdsSchema, WithMetaSchema as BaseSchema, KINDS } from "../schemas";

/**
 * =========================
 * PROPERTIES
 * =========================
 */
export const ParentSchema = v.pipe(IdsSchema, v.maxLength(2));

/**
 * =========================
 * ENTITY
 * =========================
 */
const MetaSchema = v.object({
  kind: v.literal(KINDS.FamilyTree),
  partnerId: exactOptionalUndefinable(IdSchema), // Current Partner
  // generationOrder: exactOptionalUndefinable(v.number()),
});
export const Schema = v.object({
  ...BaseSchema.entries,
  meta: MetaSchema,

  dateOfBirth: v.nullish(IsoTimestampSchema),
  dateOfDeath: v.nullish(IsoTimestampSchema),
  parentIds: v.nullish(ParentSchema),
  partnerIds: v.nullish(IdsSchema),
  childrenIds: v.nullish(IdsSchema),
});
export type Schema = v.InferOutput<typeof Schema>;
